import {
  IsArray,
  IsDateString,
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Min,
  Max,
  Matches,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateLineItemDto {
  @IsString()
  @IsNotEmpty()
  description: string;

  @IsNumber()
  @IsPositive()
  rate: number;

  @IsNumber()
  @Min(0)
  unitPrice: number;

  @IsNumber()
  @Min(0)
  @Max(28)
  gstRate: number; 
}

export enum TaxType {
  INTRA = 'intra',
  INTER = 'inter',
}

export class CreateInvoiceDto {
  @IsString()
  @IsNotEmpty()
  invoiceNumber: string;

  @IsDateString()
  issueDate: string;

  @IsOptional()
  @IsDateString()
  dueDate?: string;

  @IsOptional()
  @IsString()
  @Matches(/^(?:\+91[-\s]?|0[-\s]?)?[6-9]\d{9}$/)
  phoneNumber?: string;

  @IsString()
  @IsNotEmpty()
  customerName: string;

  @IsString()
  @IsNotEmpty()
  customerAddress: string;

  @IsOptional()
  @IsIn([TaxType.INTRA, TaxType.INTER])
  taxType?: TaxType;

  @IsOptional()
  paid?: boolean;

  @IsOptional()
  @IsIn(['paid', 'unpaid'])
  status?: 'paid' | 'unpaid';

  // attached by controller (not provided by client)
  @IsOptional()
  @IsNumber()
  userId?: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateLineItemDto)
  items: CreateLineItemDto[];
}
