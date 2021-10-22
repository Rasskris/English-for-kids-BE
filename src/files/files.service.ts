import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { S3 } from 'aws-sdk';
import { v4 as uuid } from 'uuid';
import { File } from './file.entity';
import { AWS } from '../constants';

@Injectable()
export class FilesService {
  constructor(
    @InjectRepository(File)
    private fileRepository: Repository<File>,
    private readonly configService: ConfigService,
  ) {}

  async uploadFile(databuffer: Buffer, filename: string) {
    const awsS3 = new S3();
    const uploadedResult = await awsS3
      .upload({
        Bucket: this.configService.get(AWS.PUBLIC_BUCKET_NAME),
        Body: databuffer,
        Key: `${uuid()}-${filename}`,
        ACL: 'public-read',
      })
      .promise();

    const newFile = this.fileRepository.create({
      key: uploadedResult.Key,
      url: uploadedResult.Location,
    });

    await this.fileRepository.save(newFile);

    return newFile;
  }

  async deleteFile(fileId: number) {
    const file = await this.fileRepository.findOne({ id: fileId });
    const awsS3 = new S3();
    await awsS3
      .deleteObject({
        Bucket: this.configService.get(AWS.PUBLIC_BUCKET_NAME),
        Key: file.key,
      })
      .promise();

    await this.fileRepository.delete(fileId);
  }
}
