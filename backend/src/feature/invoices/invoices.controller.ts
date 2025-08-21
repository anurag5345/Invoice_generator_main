import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
  Res,
  Req,
} from '@nestjs/common';
import { InvoicesService } from './invoices.service';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';
import { JwtAuthGuard } from '../../shared/guards/jwt-auth.guard';
import type { Response, Request } from 'express';
type AuthRequest = Request & { user?: { id: number } };
import PDFDocument from 'pdfkit';
import { LineItem } from './lineitem.model';

@UseGuards(JwtAuthGuard)
@Controller('invoices')
export class InvoicesController {
  constructor(private readonly invoices: InvoicesService) {}

  @Get(':id/pdf')
  async downloadPdf(
    @Param('id') id: string,
    @Res() res: Response,
    @Req() req: Request,
  ) {
    try {
      const invoiceInstance = await this.invoices.findOne(
        Number(id),
        (req as AuthRequest).user!.id,
      );
      const invoice = invoiceInstance?.get
        ? invoiceInstance.get({ plain: true })
        : invoiceInstance;

      if (!invoice) {
        res.status(404).send('Invoice not found');
        return;
      }

      const doc = new PDFDocument({ margin: 50 });
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader(
        'Content-Disposition',
        `attachment; filename=invoice-${invoice.invoiceNumber}.pdf`,
      );
      doc.pipe(res);

      doc
        .fontSize(24)
        .fillColor('#2E86C1')
        .text('Invoice', { align: 'center' });
      doc.moveDown(1);

      doc.fontSize(10).fillColor('black');
      doc.text(`Issue Date: ${invoice.issueDate || 'N/A'}`);
      doc.text(`Due Date: ${invoice.dueDate || 'N/A'}`);
      doc.text(`Order #: ${invoice.invoiceNumber}`);
      doc.moveDown(1.5);

      const topY = doc.y;
      doc.fontSize(12).fillColor('#000').text('Bill From:', 50, topY);
      doc
        .fontSize(10)
        .fillColor('black')
        .text(`Name: ${invoice.user?.name || 'Your Company'}`, 50, doc.y + 5);

      const rightX = 300;
      doc.fontSize(12).fillColor('#000').text('Bill To:', rightX, topY);
      doc
        .fontSize(10)
        .text(`Customer Name: ${invoice.customerName}`, rightX, doc.y + 5);
      doc.text(
        `Customer Address: ${invoice.customerAddress || 'N/A'}`,
        rightX,
        doc.y,
      );
      doc.text(
        `Customer Phone: ${invoice.phoneNumber || 'N/A'}`,
        rightX,
        doc.y,
      );

      doc.moveDown(2);

      let tableTop = doc.y;
      const itemCols = [50, 100, 250, 320, 400, 480]; 
      const rowHeight = 25;

      doc.rect(50, tableTop, 500, rowHeight).fill('#2E86C1').stroke();
      doc.fillColor('white').fontSize(11);

      doc.text('#', itemCols[0] + 5, tableTop + 7);
      doc.text('Item', itemCols[1] + 5, tableTop + 7);
      doc.text('Rate', itemCols[2] + 5, tableTop + 7);
      doc.text('Unit', itemCols[3] + 5, tableTop + 7);
      doc.text('GST %', itemCols[4] + 5, tableTop + 7);
      doc.text('Amount', itemCols[5] + 5, tableTop + 7);

      tableTop += rowHeight;
      doc.fillColor('black');

      (invoice.items ?? []).forEach((item: LineItem, idx: number) => { //change
        const amount =
          Number(item.unitPrice) *
          Number(item.rate) *
          (1 + Number(item.gstRate) / 100);

        // Draw row border
        doc.rect(50, tableTop, 500, rowHeight).stroke();

        doc.text(String(idx + 1), itemCols[0] + 5, tableTop + 7);
        doc.text(item.description, itemCols[1] + 5, tableTop + 7);
        doc.text(`INR ${String(item.rate)}`, itemCols[2] + 5, tableTop + 7);
        doc.text(
          `${Number(item.unitPrice).toFixed(2)}`,
          itemCols[3] + 5,
          tableTop + 7,
        );
        doc.text(
          `${Number(item.gstRate).toFixed(2)}%`,
          itemCols[4] + 5,
          tableTop + 7,
        );
        doc.text(`INR ${amount.toFixed(2)}`, itemCols[5] + 5, tableTop + 7);

        tableTop += rowHeight;
      });

      doc.moveDown(2);

      const summaryX = 300;
      const totalsTop = tableTop + 20;

      doc.rect(summaryX, totalsTop, 250, 80).stroke(); 
      let totalsY = totalsTop + 10;

      doc.fontSize(12).fillColor('black');
      doc.text(
        `Subtotal: INR ${Number(invoice.totalWithoutGST).toFixed(2)}`,
        summaryX + 10,
        totalsY,
      );
      totalsY += 18;
      doc.text(
        `Total GST: INR ${Number(invoice.totalGST).toFixed(2)}`,
        summaryX + 10,
        totalsY,
      );
      totalsY += 18;
      doc.text(
        `Total: INR ${Number(invoice.totalWithGST).toFixed(2)}`,
        summaryX + 10,
        totalsY,
      );
      totalsY += 18;
      doc
        .font('Helvetica-Bold')
        .text(
          `Amount Due: INR ${Number(invoice.totalWithGST).toFixed(2)}`,
          summaryX + 10,
          totalsY,
        );

      doc.moveDown(5);
      doc
        .fontSize(9)
        .fillColor('gray')
        .text('Generated by AKG Invoicing System', { align: 'center' });

      doc.end();
    } catch (err) {
      console.error('Error generating PDF:', err);
      if (!res.headersSent) {
        res.status(500).send('Error generating PDF');
      }
    }
  }

  @Post('preview/pdf')
  async previewPdf(@Body() dto: CreateInvoiceDto, @Res() res: Response) {
    try {
      const doc = new PDFDocument({ margin: 50 });

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader(
        'Content-Disposition',
        `attachment; filename=invoice-${dto.invoiceNumber || 'preview'}.pdf`,
      );

      doc.pipe(res);

      doc
        .fontSize(22)
        .fillColor('#2E86C1')
        .text('AKG INVOICE (Preview)', { align: 'center' });
      doc.moveDown();

      doc.fontSize(12).fillColor('black');
      doc.text(`Invoice Number: ${dto.invoiceNumber || 'N/A'}`);
      doc.text(`Issue Date: ${dto.issueDate || 'N/A'}`);
      doc.text(`Customer Name: ${dto.customerName || 'N/A'}`);
      doc.text(`Customer Phone: ${dto.phoneNumber || 'N/A'}`);
      doc.text(`Customer Address: ${dto.customerAddress || 'N/A'}`);

      doc.moveDown().fontSize(14).text('Items:', { underline: true });

      let subtotal = 0;
      let totalGST = 0;

      (dto.items || []).forEach(
        (
          item: import('./dto/create-invoice.dto').CreateLineItemDto,
          idx: number,
        ) => {
          const line = Number(item.rate) * Number(item.unitPrice);
          const gstAmt = line * (Number(item.gstRate || 0) / 100);
          subtotal += line;
          totalGST += gstAmt;

          doc
            .fontSize(12)
            .text(
              `${idx + 1}. ${item.description} | Rate: INR ${item.rate} | Unit:${Number(item.unitPrice).toFixed(2)} | GST: ${Number(item.gstRate || 0).toFixed(2)}%`,
            );
        },
      );

      doc.moveDown();
      doc.text(`Total (without GST): INR ${Number(subtotal).toFixed(2)}`);
      doc.text(`Total GST: INR ${Number(totalGST).toFixed(2)}`);
      doc.text(`Total (with GST): INR ${Number(subtotal + totalGST).toFixed(2)}`);

      doc
        .moveDown()
        .fontSize(10)
        .fillColor('gray')
        .text('This is a preview PDF and is not saved to the server.', {
          align: 'center',
        });

      doc.end();
    } catch (err) {
      console.error('Error generating preview PDF:', err);
      if (!res.headersSent) {
        res.status(500).send('Error generating PDF');
      }
    }
  }

  @Post()
  create(@Body() dto: CreateInvoiceDto, @Req() req: Request) {
    (
      dto as import('./dto/create-invoice.dto').CreateInvoiceDto & {
        userId?: number;
      }
    ).userId = (req as AuthRequest).user!.id;
    return this.invoices.create(dto);
  }

  @Get()
  findAll(@Req() req: Request, @Query('search') search?: string) {
    return this.invoices.findAll((req as AuthRequest).user!.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Req() req: Request) {
    return this.invoices.findOne(Number(id), (req as AuthRequest).user!.id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateInvoiceDto,
    @Req() req: Request,
  ) {
    return this.invoices.update(Number(id), dto, (req as AuthRequest).user!.id);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: Request) {
    return this.invoices.remove(Number(id), (req as AuthRequest).user!.id);
  }
}
