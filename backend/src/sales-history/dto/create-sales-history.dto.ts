import { IsString } from 'class-validator';

export class CreateSalesHistoryDto {
  @IsString()
  salesId: string;

  @IsString()
  userId: string;

  @IsString()
  detail: string;

  @IsString()
  status: string;
}

