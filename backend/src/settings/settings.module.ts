import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma.module';
import { UploadModule } from '../upload/upload.module';
import { SettingsController } from './settings.controller';
import { SettingsService } from './settings.service';

@Module({
  imports: [PrismaModule, UploadModule],
  controllers: [SettingsController],
  providers: [SettingsService],
  exports: [SettingsService],
})
export class SettingsModule {}

