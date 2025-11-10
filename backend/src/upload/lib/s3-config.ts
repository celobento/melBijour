import { S3Client } from "@aws-sdk/client-s3";

// S3 Configuration
export const s3Client = new S3Client({
  region: process.env.AWS_REGION || "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export const S3_BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME!;
export const S3_BUCKET_REGION = process.env.AWS_REGION || "us-east-1";

// Validate environment variables
export function validateS3Config() {
  const required = [
    "AWS_ACCESS_KEY_ID",
    "AWS_SECRET_ACCESS_KEY", 
    "AWS_S3_BUCKET_NAME",
    "AWS_REGION"
  ];
  
  const missing = required.filter(key => !process.env[key]);
  console.log("AWS Sttting OK");
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(", ")}`);
  }
}
