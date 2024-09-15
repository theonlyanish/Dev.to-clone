import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const s3Client = new S3Client({
  region: process.env.NEXT_PUBLIC_AWS_REGION,
  credentials: {
    accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY!,
  },
});

export async function uploadToS3(file: Uint8Array, key: string) {
  console.log("Uploading to S3", { 
    key, 
    fileSize: file.length, 
    region: process.env.NEXT_PUBLIC_AWS_REGION,
    bucketName: process.env.NEXT_PUBLIC_AWS_S3_BUCKET_NAME
  });
  const command = new PutObjectCommand({
    Bucket: process.env.NEXT_PUBLIC_AWS_S3_BUCKET_NAME,
    Key: key,
    Body: file,
    ACL: 'public-read',
  });

  try {
    const response = await s3Client.send(command);
    console.log("S3 upload response:", response);
    const url = `https://${process.env.NEXT_PUBLIC_AWS_S3_BUCKET_NAME}.s3.${process.env.NEXT_PUBLIC_AWS_REGION}.amazonaws.com/${key}`;
    console.log("Generated S3 URL:", url);
    return url;
  } catch (error) {
    console.error("Error uploading to S3:", error);
    if (error instanceof Error) {
      console.error("Error message:", error.message);
      console.error("Error stack:", error.stack);
    }
    throw error;
  }
}