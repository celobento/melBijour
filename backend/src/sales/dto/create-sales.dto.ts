import { IsArray, IsEnum, IsNumber, IsObject, IsString, Min, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { SalesState } from '@prisma/client';

export class CreateSalesProductDto {
  @IsString()
  productId: string;

  @IsNumber()
  @Min(1)
  qtd: number;

  @IsNumber()
  @Min(0)
  unitVlr: number;

  @IsNumber()
  @Min(0)
  totalValue: number;
}

export class CreateSalesDto {
  @IsString()
  customerId: string;

  @IsNumber()
  @Min(0)
  total: number;

  @IsEnum(SalesState)
  state?: SalesState;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateSalesProductDto)
  salesProducts?: CreateSalesProductDto[];
}

