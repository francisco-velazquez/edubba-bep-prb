import { ApiProperty } from '@nestjs/swagger';
import {
  IsOptional,
  IsArray,
  ValidateNested,
  IsInt,
  IsString,
  IsBoolean,
} from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateOptionDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsInt()
  id?: number;

  @ApiProperty()
  @IsString()
  optionText: string;

  @ApiProperty()
  @IsBoolean()
  isCorrect: boolean;
}

export class UpdateQuestionDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  questionText?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsInt()
  examId?: number;

  @ApiProperty({ type: [UpdateOptionDto], required: false })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateOptionDto)
  options?: UpdateOptionDto[];
}
