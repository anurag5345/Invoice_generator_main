import { Table, Column, Model, DataType, Index } from 'sequelize-typescript';

@Table({
  tableName: 'users',
  timestamps: true,
})
export class User extends Model<User> {
  @Column({ type: DataType.STRING(30), allowNull: false })
  declare name: string;

  @Index({ unique: true })
  @Column({ type: DataType.STRING(50), allowNull: false, unique: true })
  declare email: string;

  @Column({ type: DataType.STRING(100), allowNull: false })
  declare password: string;
}
