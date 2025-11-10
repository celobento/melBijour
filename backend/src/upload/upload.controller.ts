import { Body, Controller, Post } from '@nestjs/common';
import { UploadImageDto } from './dto/upload-image.dto';
import { UploadService } from './upload.service';

@Controller('uploads')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post('image')
  uploadImage(@Body() uploadDto: UploadImageDto) {
    return this.uploadService.uploadImage(uploadDto);
  }
}
