import { TransactionNature, TransactionType } from '@prisma/client';
import {
  IsDateString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';

export class UpdateTransactionDto {
  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  @IsOptional()
  amount?: number;

  @IsEnum(TransactionType)
  @IsOptional()
  type?: TransactionType;

  @IsEnum(TransactionNature)
  @IsOptional()
  nature?: TransactionNature;

  @IsDateString()
  @IsOptional()
  date?: string;

  @IsString()
  @IsOptional()
  categoryId?: string;
}
