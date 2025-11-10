import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { randomUUID } from "crypto";
import { S3_BUCKET_NAME, s3Client } from "./s3-config";

export interface UploadResult {
  success: boolean;
  url?: string;
  error?: string;
}

/**
 * Upload file directly to S3
 */
export async function uploadToS3(
  file: File,
  folder: string = "profile-images",
  userId: string
): Promise<UploadResult> {
  try {
    console.log("S3 upload - File details:", {
      name: file.name,
      size: file.size,
      type: file.type,
    });

    console.log("S3 upload - Configuration:", {
      bucket: S3_BUCKET_NAME,
      region: process.env.AWS_REGION,
    });

    const fileExtension = file.name.split('.').pop() || 'jpg';
    const fileName = `${folder}/${userId}_${randomUUID()}.${fileExtension}`;
    
    console.log("S3 upload - Generated file name:", fileName);
    
    // Convert File to Buffer (Unable to calculate hash for flowing readable stream)
    const fileBuffer = Buffer.from(await file.arrayBuffer());

    const command = new PutObjectCommand({
      Bucket: S3_BUCKET_NAME,
      Key: fileName,
      Body: fileBuffer, // Use Buffer instead of File
      ContentType: file.type,
      CacheControl: "max-age=31536000, public",   // 1 year
    });

    console.log("S3 upload - Sending command...");
    await s3Client.send(command);
    console.log("S3 upload - Command sent successfully");
    
    const url = `https://${S3_BUCKET_NAME}.s3.amazonaws.com/${fileName}`;
    console.log("S3 upload - Generated URL:", url);
    
    return {
      success: true,
      url,
    };
  } catch (error: any) {
    console.error("S3 upload error:", error);
    console.error("Error details:", {
      name: error.name,
      message: error.message,
      code: error.code,
      statusCode: error.$metadata?.httpStatusCode,
    });
    return {
      success: false,
      error: error.message || "Failed to upload file",
    };
  }
}

/**
 * Generate a presigned URL for direct client upload
 */
export async function generatePresignedUrl(
  fileName: string,
  contentType: string,
  folder: string = "profile-images"
): Promise<{ success: boolean; url?: string; error?: string }> {
  try {
    const key = `${folder}/${randomUUID()}-${fileName}`;
    
    const command = new PutObjectCommand({
      Bucket: S3_BUCKET_NAME,
      Key: key,
      ContentType: contentType,
      ACL: 'public-read',
    });

    const presignedUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
    
    return {
      success: true,
      url: presignedUrl,
    };
  } catch (error: any) {
    console.error("Presigned URL generation error:", error);
    return {
      success: false,
      error: error.message || "Failed to generate upload URL",
    };
  }
}

/**
 * Validate file type and size
 */
export function validateImageFile(file: File): { valid: boolean; error?: string } {
  const maxSize = 5 * 1024 * 1024; // 5MB
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  
  if (file.size > maxSize) {
    return { valid: false, error: "File size must be less than 5MB" };
  }
  
  if (!allowedTypes.includes(file.type)) {
    return { valid: false, error: "Only JPEG, PNG, and WebP images are allowed" };
  }
  
  return { valid: true };
}
