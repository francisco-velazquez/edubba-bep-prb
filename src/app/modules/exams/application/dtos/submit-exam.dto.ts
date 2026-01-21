import { IsArray, IsInt, ValidateNested, ArrayMinSize } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class AnswerDto {
  @ApiProperty({
    example: 1,
    description: 'Id de la pregunta',
  })
  @IsInt()
  questionId: number;

  @ApiProperty({
    example: 2,
    description: 'Id de la opción seleccionada',
  })
  @IsInt()
  optionId: number;
}

export class SubmitExamDto {
  @ApiProperty({
    type: [AnswerDto],
    description: 'Respuestas del examen',
  })
  @IsArray()
  @ArrayMinSize(1, { message: 'Debes enviar al menos una respuesta' })
  @ValidateNested({ each: true })
  @Type(() => AnswerDto)
  answers: AnswerDto[];
}

export class ExamResultResponseDto {
  score: number;
  passed: boolean;
  correctAnswers: number;
  totalQuestions: number;
}
