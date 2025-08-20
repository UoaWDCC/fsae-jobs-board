import { 
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { url } from "inspector";
import { v4 as uuidv4 } from 'uuid';

export class s3Service {
  private s3Client: S3Client;
  private bucketName: string;

  constructor() {
    const region = process.env.AWS_REGION;
    const accessKey = process.env.AWS_ACCESS_KEY;
    const secretKey = process.env.AWS_SECRET_ACCESS_KEY;
    const bucketName = process.env.AWS_BUCKET_NAME;
    
    if (!region || !accessKey || !secretKey || !bucketName) {
      throw new Error('Missing AWS configuration env variables');
    }
    
    this.s3Client = new S3Client({
      region,
      credentials: {
        accessKeyId: accessKey,
        secretAccessKey: secretKey
      }
    });

    this.bucketName = bucketName;
  }

  async uploadFile(
    fileBuffer: Buffer,
    fileName: string,
    mimeType: string
  ): Promise<{key: string, url: string}> {
    const fileExtension = fileName.split('.').pop() || '';
    const key = `${uuidv4()}.${fileExtension}`;

    const uploadParams = {
      Bucket: this.bucketName,
      Key: key,
      Body: fileBuffer,
      ContentType: mimeType
    };

    try {
      await this.s3Client.send(new PutObjectCommand(uploadParams));
      const url = `https://${this.bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
      console.log(`File uploaded successfully. Key: ${key}, URL: ${url}`);
      return { key, url };
    } catch (error) {
      throw new Error(`Failed to upload file: ${error.message}`);
    }
  };
}
