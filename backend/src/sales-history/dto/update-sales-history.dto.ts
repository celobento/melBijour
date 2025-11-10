import { PartialType } from '@nestjs/mapped-types';
import { CreateSalesHistoryDto } from './create-sales-history.dto';

export class UpdateSalesHistoryDto extends PartialType(CreateSalesHistoryDto) {}

