import {
  S3Client
} from '@aws-sdk/client-s3';
import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { UploadImageDto } from './dto/upload-image.dto';
import { validateS3Config } from './lib/s3-config';
import { uploadToS3, validateImageFile } from './lib/s3-upload';

@Injectable()
export class UploadService {
  private readonly s3: S3Client;
  private readonly bucket: string;
  private readonly region: string;
  private readonly publicBaseUrl?: string;

  constructor() {
    this.bucket = process.env.AWS_S3_BUCKET_NAME ?? '';
    this.region = process.env.AWS_REGION ?? 'us-east-1';
    this.publicBaseUrl = process.env.AWS_S3_PUBLIC_URL;

    if (!this.bucket) {
      throw new Error('AWS_S3_BUCKET environment variable is not set');
    }

    this.s3 = new S3Client({
      region: this.region,
      credentials:
        process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY
          ? {
              accessKeyId: process.env.AWS_ACCESS_KEY_ID,
              secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
            }
          : undefined,
    });
  }

  async uploadImage(dto: UploadImageDto) {
    try {
      console.log("Upload image route called");
      
      // Validate S3 configuration
      try {
        validateS3Config();
      } catch (configError: any) {
        console.error("S3 configuration error:", configError);
        throw new InternalServerErrorException(`S3 configuration error: ${configError.message}`);
      }
  
      const fileBuffer = Buffer.from(dto.fileBase64, "base64");
      const file = new File([fileBuffer], "image.jpg", { type: "image/jpeg" });
  
      if (!file) {
        throw new BadRequestException("No file provided");
      }
  
      console.log("File details:", {
        name: file.name,
        size: file.size,
        type: file.type,
      });
  
      // Validate file
      const validation = validateImageFile(file);
      if (!validation.valid) {
        throw new BadRequestException(validation.error);
      }
  
      // Upload to S3
      console.log("Starting S3 upload...");
      const result = await uploadToS3(file, dto.folder??'general', dto.userId??'');
  
      if (!result.success) {
        console.error("S3 upload failed:", result.error);
        throw new InternalServerErrorException(result.error || "Upload failed");
      }
  
      console.log("S3 upload successful:", result.url);
      return {
        success: true,
        url: result.url,
      };
    } catch (error) {
      throw new InternalServerErrorException('Failed to upload image to S3');
    }
  }

  private getFileExtension(fileName?: string, mimeType?: string) {
    if (fileName && fileName.includes('.')) {
      return fileName.substring(fileName.lastIndexOf('.'));
    }

    switch (mimeType) {
      case 'image/png':
        return '.png';
      case 'image/webp':
        return '.webp';
      case 'image/gif':
        return '.gif';
      case 'image/jpeg':
      case 'image/jpg':
      default:
        return '.jpg';
    }
  }
}
