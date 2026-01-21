import {
  IsString,
  IsInt,
  IsArray,
  ValidateNested,
  IsBoolean,
  IsEnum,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

class CreateOptionDto {
  @ApiProperty({
    example: 'Opción 1',
    description: 'Texto de la opción',
  })
  @IsString()
  optionText: string;

  @ApiProperty({
    example: false,
    description: 'Indica si esta es la opción correcta',
  })
  @IsBoolean()
  isCorrect: boolean;
}

class CreateQuestionDto {
  @ApiProperty({
    example: 'Pregunta 1',
    description: 'Texto de la pregunta',
  })
  @IsString()
  questionText: string;

  @ApiProperty({
    example: 'multiple_choice',
    description: 'Tipo de pregunta',
  })
  @IsEnum(['multiple_choice', 'true_false'])
  questionType: 'multiple_choice' | 'true_false';
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateOptionDto)
  options: CreateOptionDto[];
}

export class CreateExamDto {
  @ApiProperty({
    example: 'Examen de Matemáticas',
    description: 'Título del examen',
  })
  @IsString()
  title: string;

  @ApiProperty({
    example: 1,
    description: 'Id del módulo al que pertenece el examen',
  })
  @IsInt()
  moduleId: number;

  @ApiProperty({
    type: [CreateQuestionDto],
    description: 'Preguntas del examen',
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateQuestionDto)
  questions: CreateQuestionDto[];
}
