import { IsBase64, IsOptional, IsString } from 'class-validator';

export class UploadImageDto {
  @IsBase64()
  fileBase64: string;

  @IsOptional()
  @IsString()
  fileName?: string;

  @IsOptional()
  @IsString()
  mimeType?: string;

  @IsOptional()
  @IsString()
  userId?: string;

  @IsOptional()
  @IsString()
  folder?: string;
}
