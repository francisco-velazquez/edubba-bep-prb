/// <reference types="multer" />
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';
import { IStoragePort } from '../../application/ports/storage.port';
import { v4 as uuid } from 'uuid';
import { extname } from 'path';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

@Injectable()
export class S3StorageProvider implements IStoragePort {
  private s3Client: S3Client;
  private bucketName: string;
  private region: string;

  constructor(protected configService: ConfigService) {
    const accessKeyId = this.configService.get<string>('AWS_ACCESS_KEY_ID');
    const secretAccessKey = this.configService.get<string>(
      'AWS_SECRET_ACCESS_KEY',
    );
    const region = this.configService.get<string>('AWS_S3_REGION');
    const bucketName = this.configService.get<string>('AWS_S3_BUCKET_NAME');

    // Validación estricta para satisfacer a TS y evitar errores en runtime
    if (!accessKeyId || !secretAccessKey || !region || !bucketName) {
      throw new Error(
        'AWS S3 configuration is missing in environment variables',
      );
    }

    this.region = region;
    this.bucketName = bucketName;

    this.s3Client = new S3Client({
      region: this.region,
      credentials: {
        accessKeyId: accessKeyId,
        secretAccessKey: secretAccessKey,
      },
    });
  }

  async upload(file: Express.Multer.File, folder: string): Promise<string> {
    const fileExtension = extname(file.originalname);
    const fileName = `${folder}/${uuid()}${fileExtension}`;

    try {
      await this.s3Client.send(
        new PutObjectCommand({
          Bucket: this.bucketName,
          Key: fileName,
          Body: file.buffer,
          ContentType: file.mimetype,
          // ACL: 'public-read' // Opcional, dependiendo de la config del bucket
        }),
      );

      // Retornamos la URL pública (o la key si usas CloudFront)
      return `https://${this.bucketName}.s3.${this.region}.amazonaws.com/${fileName}`;
    } catch (error) {
      throw new InternalServerErrorException(
        `Error uploading file to S3: ${(error as Error).message}`,
      );
    }
  }

  async generateUploadUrl(
    originalName: string,
    folder: string,
    contentType: string,
  ): Promise<{ uploadUrl: string; fileUrl: string }> {
    console.log('Url', originalName, folder, contentType, this.bucketName);
    const fileExtension = extname(originalName);
    const key = `${folder}/${uuid()}${fileExtension}`;

    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: key,
      ContentType: contentType,
    });

    try {
      // La URL expira en 600 segundos (10 minutos)
      const uploadUrl = await getSignedUrl(this.s3Client, command, {
        expiresIn: 600,
      });

      // Esta es la URL final donde el archivo será accesible después de la subida]
      const fileUrl = `https://${this.bucketName}.s3.${this.region}.amazonaws.com/${key}`;

      return { uploadUrl, fileUrl };
    } catch (error) {
      throw new InternalServerErrorException(
        `Error generating presigned URL: ${(error as Error).message}`,
      );
    }
  }

  async delete(fileUrl: string): Promise<void> {
    const key = fileUrl.split('.amazonaws.com/')[1];
    try {
      await this.s3Client.send(
        new DeleteObjectCommand({
          Bucket: this.bucketName,
          Key: key,
        }),
      );
    } catch (error) {
      console.error('Error deleting from S3', error);
    }
  }
}
