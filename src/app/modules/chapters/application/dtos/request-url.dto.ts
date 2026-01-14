import { IsString, IsNotEmpty, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RequestUrlDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  fileName: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  contentType: string;

  @ApiProperty({ enum: ['video', 'content'] })
  @IsEnum(['video', 'content'])
  type: 'video' | 'content';
}
