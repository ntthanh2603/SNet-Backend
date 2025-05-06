import { BadRequestException } from '@nestjs/common';
import * as fs from 'fs';

export default function deleteFile(filePath: string): void {
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  } catch {
    throw new BadRequestException('Error deleting file');
  }
}
