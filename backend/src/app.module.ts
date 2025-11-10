import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { CustomerModule } from './customer/customer.module';
import { UploadModule } from './upload/upload.module';

@Module({
  imports: [PrismaModule, AuthModule, UserModule, CustomerModule, UploadModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
