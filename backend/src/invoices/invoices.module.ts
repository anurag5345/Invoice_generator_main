import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { InvoicesController } from './invoices.controller';
import { InvoicesService } from './invoices.service';
import { Invoice } from './invoice.model';
import { LineItem } from './lineitem.model';

@Module({
  imports: [SequelizeModule.forFeature([Invoice, LineItem])],
  controllers: [InvoicesController],
  providers: [InvoicesService],
})
export class InvoicesModule {}
