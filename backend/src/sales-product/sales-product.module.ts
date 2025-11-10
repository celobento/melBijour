import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma.module';
import { SalesProductController } from './sales-product.controller';
import { SalesProductService } from './sales-product.service';

@Module({
  imports: [PrismaModule],
  controllers: [SalesProductController],
  providers: [SalesProductService],
  exports: [SalesProductService],
})
export class SalesProductModule {}

