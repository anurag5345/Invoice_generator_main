import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './feature/users/users.module';
import { InvoicesModule } from './feature/invoices/invoices.module';
import { User } from './feature/users/users.model';
import { Invoice } from './feature/invoices/invoice.model';
import { LineItem } from './feature/invoices/lineitem.model';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    SequelizeModule.forRoot({
      dialect: 'mysql',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      models: [User, Invoice, LineItem],
      autoLoadModels: true,
      synchronize: true, 
      logging: false,
    }),
    AuthModule,
    UsersModule,
    InvoicesModule,
  ],
})
export class AppModule {}
