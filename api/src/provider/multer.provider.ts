import {Provider} from '@loopback/core';
import multer from 'multer';

export class MulterProvider implements Provider<multer.Multer> {
  value(): multer.Multer {
    return multer({
      storage: multer.memoryStorage(),
      limits: {fileSize: 16 * 1024 * 1024},
    });
  }
}