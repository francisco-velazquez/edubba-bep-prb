import { Exclude, Expose, Type } from 'class-transformer';
import { Exam, StudentExam } from '../../domain/entities/exam.entity';

export class OptionResponseDto {
  @Expose() id: number;
  @Expose() optionText: string;

  // Solo exponemos isCorrect si el valor existe en el objeto original
  // (Para alumnos será undefined y no se enviará en el JSON)
  @Expose()
  isCorrect?: boolean;
}

export class QuestionResponseDto {
  @Expose() id: number;
  @Expose() questionText: string;
  @Expose() questionType: string;

  @Expose()
  @Type(() => OptionResponseDto)
  options: OptionResponseDto[];
}

@Exclude() // Bloquea todas las propiedades que no tengan @Expose()
export class ExamResponseDto {
  @Expose() id: number;
  @Expose() title: string;
  @Expose() moduleId: number;

  @Expose()
  @Type(() => QuestionResponseDto)
  questions: QuestionResponseDto[];

  constructor(partial: Exam | StudentExam) {
    Object.assign(this, partial);
  }
}
