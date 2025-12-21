import { ModuleResponseDto } from 'src/app/modules/modules/application/dtos/module-response.dto';
import { Exam } from '../../domain/exam.entity';

export class ExamResponseDto {
  id: number;
  title: string;
  moduleId: number;

  module?: ModuleResponseDto;

  constructor(exam: Exam) {
    this.id = exam.id;
    this.title = exam.title;
    this.moduleId = exam.moduleId;

    if (exam.module) {
      this.module = new ModuleResponseDto(exam.module);
    }
  }
}
