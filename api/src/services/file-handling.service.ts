import { Request, Response } from '@loopback/rest';
import multer from 'multer';
import { s3ServiceInstance } from './s3.service';
import { MemberRepository } from '../repositories';

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 16 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'image/jpeg',
      'image/png'
    ];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type.'));
    }
  }
});

export class FileHandlerService {
  constructor(private repo: any) {}

  async handleUpload(
    repository: any,
    currentUserProfile: any,
    req: Request,
    fileField: string, // "avatar" or "cv" or "banner"
    memberField: 'avatarS3Key' | 'cvS3Key' | 'bannerS3Key',
    response: Response,
    deleteExisting: boolean = true,
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      upload.single(fileField)(req, response, async (err) => {
        if (err) {
          resolve({ success: false, message: err.message || 'Upload failed' });
          return;
        }
        const file = (req as any).file;
        if (!file) {
          resolve({ success: false, message: 'No file uploaded' });
          return;
        }

        const memberId = currentUserProfile?.id;
        if (!memberId) {
          resolve({ success: false, message: 'User not authenticated' });
          return;
        }

        try {
          const existingMember = await repository.findById(memberId);
          // If user has existing file, delete the existing file from S3
          if (deleteExisting && existingMember[memberField]) {
            console.log(`Deleting existing file: ${existingMember[memberField]}`);
            try {
              await s3ServiceInstance.deleteFile(existingMember[memberField]);
              console.log('Successfully deleted existing file');
            } catch (err) {
              console.error('Error deleting existing file:', err);
            }
          }
          const { key, url } = await s3ServiceInstance.uploadFile(
            file.buffer,
            file.originalname,
            file.mimetype
          );

          // Store S3 Url in MongoDB
          await repository.updateById(memberId, {
            [memberField]: key,
            ...(fileField === 'cv' ? { hasCV: true } : {}),
          });

          resolve({
            success: true,
            message: `${fileField.toUpperCase()} uploaded successfully`,
            key,
            url,
            metadata: {
              filename: file.originalname,
              mimetype: file.mimetype,
              size: file.size,
            },
          });
        } catch (error) {
          console.error('S3 upload error:', error);
          resolve({
            success: false,
            message: `Failed to upload ${fileField.toUpperCase()} to S3`,
          });
        }
      });
    });
  }

  async handleViewFile(
    repository: any,
    memberId: string,
    memberField: 'cvS3Key' | 'avatarS3Key' | 'bannerS3Key',
    response: Response,
    inline: boolean = true,
  ) {
    const member = await repository.findById(memberId);
    const s3Key = (member as any)[memberField];

    if (!s3Key) {
      response.status(404).json({ message: 'File not found' });
      return;
    }

    try {
      const s3Object = await s3ServiceInstance.getObject(s3Key);
      const contentType = s3Object.ContentType ?? 'application/octet-stream';
      const fileName = (s3Object.Metadata && s3Object.Metadata.originalfilename) || 'file';

      // convert S3 stream to Buffer
      const chunks: Uint8Array[] = [];
      for await (const chunk of s3Object.Body as any) {
        chunks.push(chunk);
      }
      const buffer = Buffer.concat(chunks);

      response.setHeader('Content-Type', contentType);
      response.setHeader('Content-Disposition', `${inline ? 'inline' : 'attachment'}; filename="${fileName}"`);
      response.send(buffer);
    } catch (err) {
      console.error('File view/download error:', err);
      response.status(500).json({ message: 'Failed to fetch file' });
    }
  }

  async handleDeleteFile(
    repository: any,
    memberId: string,
    memberField: 'cvS3Key' | 'avatarS3Key' | 'bannerS3Key',
    deleteFlag?: string, // only needed for CV
  ) {
    const member = await repository.findById(memberId);
    const s3Key = (member as any)[memberField];

    if (s3Key) {
      await s3ServiceInstance.deleteFile(s3Key);

      const updateData: any = { [memberField]: '' };
      if (deleteFlag) {
        updateData[deleteFlag] = false;
      }

      await repository.updateById(memberId, updateData);
    }
  }

}