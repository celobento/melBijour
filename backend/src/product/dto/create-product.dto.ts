import { ProductCategory } from '@prisma/client';
import { IsEnum, IsNumber, IsOptional, IsString, IsUrl, Min } from 'class-validator';

export class CreateProductDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsUrl()
  image?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  currentStock?: number;

  @IsNumber()
  @Min(0)
  value: number;

  @IsEnum(ProductCategory)
  productCategory: ProductCategory;
}

