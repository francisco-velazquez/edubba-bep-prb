import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsIn, IsNotEmpty } from 'class-validator';

export class RequestUploadDto {
  @ApiProperty({ description: 'Name of the file to upload' })
  @IsString()
  @IsNotEmpty()
  fileName: string;

  @ApiProperty({ description: 'MIME type of the file' })
  @IsString()
  @IsNotEmpty()
  contentType: string;

  @ApiProperty({ description: 'Type of media', enum: ['video', 'content'] })
  @IsIn(['video', 'content'])
  type: 'video' | 'content';
}
