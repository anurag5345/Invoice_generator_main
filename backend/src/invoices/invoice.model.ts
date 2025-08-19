import {
  Table,
  Column,
  Model,
  DataType,
  HasMany,
  DefaultScope,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { LineItem } from './lineitem.model';
import { User } from '../users/users.model';

@DefaultScope(() => ({
  include: [{ model: LineItem, as: 'items' }], // ensure alias matches association
  order: [['createdAt', 'DESC']],
}))
@Table({
  tableName: 'invoices',
  timestamps: true,
})
export class Invoice extends Model<Invoice> {
  @Column({ type: DataType.STRING, allowNull: false })
  declare invoiceNumber: string;

  @Column({ type: DataType.DATEONLY, allowNull: false })
  declare issueDate: Date | null;

  @Column({ type: DataType.DATEONLY, allowNull: true })
  declare dueDate?: Date | null;

  @Column({ type: DataType.STRING(15), allowNull: true })
  declare phoneNumber?: string;

  @Column({ type: DataType.STRING(30), allowNull: false })
  declare customerName: string;

  @Column({ type: DataType.STRING, allowNull: true })
  declare customerAddress: string;

  @Column({
    type: DataType.ENUM('intra', 'inter'),
    allowNull: false,
    defaultValue: 'intra',
  })
  declare taxType: 'intra' | 'inter';

  @Column({ type: DataType.DECIMAL(12, 2), allowNull: false, defaultValue: 0 })
  declare totalWithoutGST: number;

  @Column({ type: DataType.DECIMAL(12, 2), allowNull: false, defaultValue: 0 })
  declare totalGST: number;

  @Column({ type: DataType.DECIMAL(12, 2), allowNull: false, defaultValue: 0 })
  declare totalWithGST: number;

  @Column({ type: DataType.DECIMAL(12, 2), allowNull: false, defaultValue: 0 })
  declare cgst: number;

  @Column({ type: DataType.DECIMAL(12, 2), allowNull: false, defaultValue: 0 })
  declare sgst: number;

  @Column({ type: DataType.DECIMAL(12, 2), allowNull: false, defaultValue: 0 })
  declare igst: number;

  @Column({ type: DataType.BOOLEAN, allowNull: false, defaultValue: false })
  declare paid: boolean;

  @Column({
    type: DataType.ENUM('paid', 'unpaid'),
    allowNull: false,
    defaultValue: 'unpaid',
  })
  declare status: 'paid' | 'unpaid';

  @Column({ type: DataType.BOOLEAN, allowNull: false, defaultValue: true })
  declare active: boolean;

  @HasMany(() => LineItem, { as: 'items', foreignKey: 'invoiceId' })
  declare items: LineItem[];

  @ForeignKey(() => User)
  @Column({ type: DataType.INTEGER, allowNull: false })
  declare userId: number;

  @BelongsTo(() => User)
  declare user: User;
}
