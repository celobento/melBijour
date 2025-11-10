import { IsNumber, IsString, Min } from 'class-validator';

export class CreateSalesProductDto {
  @IsString()
  salesId: string;

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

