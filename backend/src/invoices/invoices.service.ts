import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Sequelize } from 'sequelize-typescript';
import { Invoice } from './invoice.model';
import { LineItem } from './lineitem.model';
import { CreateInvoiceDto, TaxType } from './dto/create-invoice.dto';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';

@Injectable()
export class InvoicesService {
  async findOneFull(id: number) {
    return await this.invoiceModel.findOne({
      where: { id },
      include: [
        {
          model: LineItem,
          as: 'items',
          attributes: ['description', 'rate', 'unitPrice', 'gstRate'],
        },
      ],
    });
  }

  constructor(
    @InjectModel(Invoice) private readonly invoiceModel: typeof Invoice,
    @InjectModel(LineItem) private readonly lineItemModel: typeof LineItem,
    private readonly sequelize: Sequelize,
  ) {}

  private computeTotals(
    items: { rate: number; unitPrice: number; gstRate: number }[],
    taxType: 'intra' | 'inter',
  ) {
    let subtotal = 0;
    let totalGST = 0;
    let cgst = 0;
    let sgst = 0;
    let igst = 0;

    for (const it of items) {
      const line = Number(it.rate) * Number(it.unitPrice);
      const gstAmt = line * (Number(it.gstRate) / 100);
      subtotal += line;
      totalGST += gstAmt;

      if (taxType === 'intra') {
        cgst += gstAmt / 2;
        sgst += gstAmt / 2;
      } else {
        igst += gstAmt;
      }
    }

    const total = subtotal + totalGST;
    return {
      totalWithoutGST: Number(subtotal.toFixed(2)),
      totalGST: Number(totalGST.toFixed(2)),
      totalWithGST: Number(total.toFixed(2)),
      cgst: Number(cgst.toFixed(2)),
      sgst: Number(sgst.toFixed(2)),
      igst: Number(igst.toFixed(2)),
    };
  }

  async create(dto: CreateInvoiceDto) {
    if (!dto.items?.length) {
      throw new BadRequestException('Invoice must have at least one line item');
    }
    const taxType = (dto.taxType || TaxType.INTRA) as 'intra' | 'inter';

    // expect createInvoiceDto to contain userId set by controller
    return this.sequelize.transaction(async (t) => {
      const totals = this.computeTotals(dto.items, taxType);

      const invoice = await this.invoiceModel.create(
        {
          invoiceNumber: dto.invoiceNumber,
          issueDate: dto.issueDate ? new Date(dto.issueDate) : new Date(),
          dueDate: dto.dueDate ? new Date(dto.dueDate) : null,
          phoneNumber: dto.phoneNumber || null,
          customerName: dto.customerName,
          customerAddress: dto.customerAddress || null,
          taxType,
          userId: dto.userId!,
          paid: !!dto.paid,
          status: dto.status || (dto.paid ? 'paid' : 'unpaid'),
          ...totals,
        } as unknown as Invoice,
        { transaction: t },
      );

      const itemsToCreate: Partial<LineItem>[] = dto.items.map((i) => ({
        invoiceId: invoice.id,
        description: i.description,
        rate: i.rate,
        unitPrice: i.unitPrice,
        gstRate: i.gstRate,
      }));

      await this.lineItemModel.bulkCreate(itemsToCreate as LineItem[], { //change
        transaction: t,
      });
      const withItems = await this.invoiceModel.findByPk(invoice.id, {
        include: [LineItem],
        transaction: t,
      });
      return withItems;
    });
  }

  async findAll(userId: number) {
    const invoices = await this.invoiceModel.findAll({
      where: { userId, active: true },
      include: [{ all: true }],
    });
    return invoices;
  }

  async findOne(id: number, userId: number) {
    const invoice = await this.invoiceModel.findOne({
      where: { id, userId, active: true },
      include: [{ all: true }],
    });
    if (!invoice) throw new NotFoundException('Invoice not found');
    return invoice;
  }

  async update(id: number, updateInvoiceDto: UpdateInvoiceDto, userId: number) {
    const existing = await this.invoiceModel.findOne({
      where: { id, userId },
      include: [LineItem],
    });
    if (!existing) throw new NotFoundException('Invoice not found');

    // allow partial updates - if caller is only toggling `paid`, skip items totals recompute
    // support toggling paid or status as a minimal partial update
    if (updateInvoiceDto && !updateInvoiceDto.items) {
      const patch: Partial<Pick<Invoice, 'paid' | 'status'>> = {};
      if (Object.prototype.hasOwnProperty.call(updateInvoiceDto, 'paid')) {
        patch.paid = !!updateInvoiceDto.paid;
        // keep status in sync
        patch.status = patch.paid ? 'paid' : 'unpaid';
      }
      if (Object.prototype.hasOwnProperty.call(updateInvoiceDto, 'status')) {
        patch.status = updateInvoiceDto.status === 'paid' ? 'paid' : 'unpaid';
        patch.paid = patch.status === 'paid';
      }
      if (Object.keys(patch).length) {
        await existing.update(patch);
        return await this.invoiceModel.findOne({
          where: { id, userId },
          include: [LineItem],
        });
      }
    }

    const taxType = (updateInvoiceDto.taxType ||
      existing.taxType ||
      TaxType.INTRA) as 'intra' | 'inter';
    const totals = this.computeTotals(updateInvoiceDto.items || [], taxType);

    return this.sequelize.transaction(async (t) => {
      await existing.update(
        {
          invoiceNumber: updateInvoiceDto.invoiceNumber,
          issueDate: updateInvoiceDto.issueDate
            ? new Date(updateInvoiceDto.issueDate)
            : existing.issueDate,
          dueDate: updateInvoiceDto.dueDate || null,
          phoneNumber:
            updateInvoiceDto.phoneNumber || existing.phoneNumber || null,
          customerName: updateInvoiceDto.customerName,
          customerAddress: updateInvoiceDto.customerAddress || null,
          taxType,
          paid:
            typeof updateInvoiceDto.paid === 'boolean'
              ? updateInvoiceDto.paid
              : existing.paid,
          ...totals,
        } as unknown as Invoice,  //change
        { transaction: t },
      );

      // replace items
      await this.lineItemModel.destroy({
        where: { invoiceId: id },
        transaction: t,
      });
      const itemsToCreate = (updateInvoiceDto.items || []).map((i) => ({
        invoiceId: id,
        description: i.description,
        rate: i.rate,
        unitPrice: i.unitPrice,
        gstRate: i.gstRate,
      }));
      if (itemsToCreate.length) {
        await this.lineItemModel.bulkCreate(itemsToCreate as LineItem[], {  // 
          transaction: t,
        });
      }

      const updated = await this.invoiceModel.findOne({
        where: { id, userId },
        include: [LineItem],
        transaction: t,
      });
      return updated;
    });
  }

  async remove(id: number, userId: number) {
    const invoice = await this.invoiceModel.findOne({
      where: { id, userId, active: true },
    });
    if (!invoice) throw new NotFoundException('Invoice not found');
    await invoice.update({
      active: false,
      paid: false,
      status: 'unpaid',
    });
    return { deleted: true };
  }
}
