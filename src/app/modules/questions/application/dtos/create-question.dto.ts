import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsString,
  IsArray,
  ValidateNested,
  IsBoolean,
  ArrayMinSize,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { QuestionType } from '../../domain/question.entity';

export class CreateOptionDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  questionId: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  optionText: string;

  @ApiProperty()
  @IsBoolean()
  isCorrect: boolean;
}

export class CreateQuestionDto {
  @ApiProperty()
  @IsInt()
  @IsNotEmpty()
  examId: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  questionText: string;

  @ApiProperty({ enum: QuestionType })
  @IsEnum(QuestionType)
  questionType: QuestionType;

  @ApiProperty({ type: [CreateOptionDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @ArrayMinSize(2) // Al menos 2 opciones
  @Type(() => CreateOptionDto)
  options: CreateOptionDto[];
}
