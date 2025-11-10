import {
  Body,
  Controller,
  Get,
  Post
} from '@nestjs/common';
import { UploadImageDto } from '../upload/dto/upload-image.dto';
import { UploadService } from '../upload/upload.service';
import { CreateSettingsDto } from './dto/create-settings.dto';
import { SettingsService } from './settings.service';

@Controller('settings')
export class SettingsController {
  constructor(private readonly settingsService: SettingsService, private readonly uploadService: UploadService) {}

  @Post('admin')
  async create(@Body() createSettingsDto: CreateSettingsDto) {
    return await this.settingsService.create(createSettingsDto);
  }

  @Post('upload-logo')
  async uploadLogo(@Body() uploadDto: UploadImageDto) {
    console.log("Upload logo route called");
    console.log("Upload DTO: " + JSON.stringify(uploadDto));
    return await this.uploadService.uploadImage(uploadDto);
  }

  @Get()
  findAll() {
    return this.settingsService.findAll();
  }

  @Get('logo-name')
  findLogoName() {
    return this.settingsService.findLogoName();
  }


  @Get('pix-key')
  findPixKey() {
    return this.settingsService.findPixKey();
  }

  @Get('admin')
  findAdmin() {
    return this.settingsService.findAdmin();
  }

}

