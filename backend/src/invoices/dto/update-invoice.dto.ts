import {
  IsArray,
  IsDateString,
  IsEnum,
  IsOptional,
  IsString,
  Matches,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CreateLineItemDto, TaxType } from './create-invoice.dto';

export class UpdateInvoiceDto {
  @IsOptional()
  @IsString()
  invoiceNumber?: string;

  @IsOptional()
  @IsDateString()
  issueDate?: string;

  @IsOptional()
  @IsDateString()
  dueDate?: string;

  @IsOptional()
  @IsString()
  @Matches(/^(?:\+91[-\s]?|0[-\s]?)?[6-9]\d{9}$/)
  phoneNumber?: string;

  @IsOptional()
  @IsString()
  customerName?: string;

  @IsOptional()
  @IsString()
  customerAddress?: string;

  @IsOptional()
  @IsEnum(TaxType)
  taxType?: TaxType;

  @IsOptional()
  paid?: boolean;

  @IsOptional()
  status?: 'paid' | 'unpaid';

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateLineItemDto)
  items?: CreateLineItemDto[];
}
