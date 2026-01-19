import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
  IsUrl,
} from 'class-validator';

export class CreateChapterDto {
  @ApiProperty({
    description: 'Title for the chapter',
    example: 'Introduction',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    description: 'Description for the chapter',
    example: 'This is the introduction chapter',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'Id of the module to which the chapter belongs',
    example: 1,
  })
  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  moduleId: number;

  @ApiProperty({
    description: 'Url of the video',
    example: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
  })
  @IsString()
  @IsUrl()
  @IsOptional()
  videoUrl?: string;

  @ApiProperty({
    description: 'Url of the content upload',
    example: 'https://www.onedrive.com/additional-material.pdf',
  })
  @IsString()
  @IsUrl()
  @IsOptional()
  contentUrl?: string;

  @ApiProperty({
    description: 'Index to order the chapters',
    example: 1,
    default: 0,
  })
  @IsInt()
  @IsPositive()
  @IsOptional()
  orderIndex?: number;

  @ApiProperty({
    description: 'State of the chapter',
    example: true,
    default: false,
  })
  @IsBoolean()
  @IsOptional()
  isPublished?: boolean;
}
