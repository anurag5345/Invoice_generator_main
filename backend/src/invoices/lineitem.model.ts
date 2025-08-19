import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { Invoice } from './invoice.model';

@Table({
  tableName: 'line_items',
  timestamps: true,
})
export class LineItem extends Model<LineItem> {
  @ForeignKey(() => Invoice)
  @Column({ type: DataType.INTEGER, allowNull: false })
  declare invoiceId: number;

  @BelongsTo(() => Invoice, { as: 'invoice' })
  declare invoice: Invoice;

  @Column({ type: DataType.STRING(100), allowNull: false })
  declare description: string;

  @Column({ type: DataType.INTEGER, allowNull: false })
  declare rate: number;

  @Column({ type: DataType.DECIMAL(12, 2), allowNull: false })
  declare unitPrice: number;

  @Column({ type: DataType.DECIMAL(12, 2), allowNull: false })
  declare gstRate: number;
}
