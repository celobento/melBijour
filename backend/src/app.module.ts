import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { CustomerModule } from './customer/customer.module';
import { PrismaModule } from './prisma.module';
import { ProductModule } from './product/product.module';
import { SalesModule } from './sales/sales.module';
import { SalesHistoryModule } from './sales-history/sales-history.module';
import { SalesProductModule } from './sales-product/sales-product.module';
import { SettingsModule } from './settings/settings.module';
import { UploadModule } from './upload/upload.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    UserModule,
    CustomerModule,
    UploadModule,
    SettingsModule,
    ProductModule,
    SalesModule,
    SalesHistoryModule,
    SalesProductModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
