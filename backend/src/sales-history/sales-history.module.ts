import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma.module';
import { SalesHistoryController } from './sales-history.controller';
import { SalesHistoryService } from './sales-history.service';

@Module({
  imports: [PrismaModule],
  controllers: [SalesHistoryController],
  providers: [SalesHistoryService],
  exports: [SalesHistoryService],
})
export class SalesHistoryModule {}

