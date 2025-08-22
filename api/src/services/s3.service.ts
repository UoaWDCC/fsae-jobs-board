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

    const cacheControl = this.getFileCacheControl(fileExtension);

    const uploadParams = {
      Bucket: this.bucketName,
      Key: key,
      Body: fileBuffer,
      ContentType: mimeType,
      CacheControl: cacheControl,
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

  // determine cache control per file type
  private getFileCacheControl(fileExtension: string): string {
    switch (fileExtension) {
      case 'pdf':
      case 'doc':
      case 'docx':
        // 1 week
        return 'public, max-age=604800, must-revalidate';
        
      // this can be used for avatar images in the future
      case 'jpg':
      case 'jpeg':
      case 'png':
        // 2 weeks
        return 'public, max-age=1209600, must-revalidate';
        
      default:
        // 24hrs
        return 'public, max-age=86400, must-revalidate';
    }
  }

  async getDownloadUrl(key: string): Promise<string> {
    const command = new GetObjectCommand({
      Bucket: this.bucketName,
      Key: key
    });

    try {
      const url = await getSignedUrl(this.s3Client, command, { expiresIn: 3600 });
      console.log(`Download URL generated: ${url}`);
      return url;
    } catch (error) {
      throw new Error(`Failed to generate download URL: ${error.message}`);
    }
  }

  async deleteFile(key: string): Promise<void> {
    const deleteParams = {
      Bucket: this.bucketName,
      Key: key
    };

    try {
      await this.s3Client.send(new DeleteObjectCommand(deleteParams));
      console.log(`File deleted successfully. Key: ${key}`);
    } catch (error) {
      throw new Error(`Failed to delete file: ${error.message}`);
    }
  }

  async getPreviewUrl(key: string): Promise<string> {
    try {
      const command = new GetObjectCommand({
        Bucket: this.bucketName,
        Key: key,
        ResponseContentDisposition: 'inline' // show in browser
      });
      
      return await getSignedUrl(this.s3Client, command, { expiresIn: 900 });
    } catch (error) {
      console.error('Error generating preview URL:', error);
      throw new Error(`Failed to generate preview URL: ${error.message}`);
    }
  }
}

export const s3ServiceInstance = new s3Service();