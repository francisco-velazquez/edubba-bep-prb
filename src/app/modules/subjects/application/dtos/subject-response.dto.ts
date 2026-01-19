import { GradeResponseDto } from 'src/app/modules/grades/application/dtos/grade-response.dto';
import { Subject } from '../../domain/subject.entity';
import { ModuleResponseDto } from 'src/app/modules/modules/application/dtos/module-response.dto';
import { ProgressResultDto } from 'src/app/modules/student-progress/application/dtos/calculate-progress-result.dto';

export class SubjectResponseDto {
  id: number;
  name: string;
  isActive: boolean;
  grade?: GradeResponseDto;
  modules?: ModuleResponseDto[];
  description?: string;
  code?: string;
  createdAt: Date;
  updatedAt: Date;
  progress?: ProgressResultDto;

  setProgress(progress: ProgressResultDto) {
    this.progress = progress;
  }

  constructor(subject: Subject) {
    console.log(`Subject`, JSON.stringify(subject));
    this.id = subject.id;
    this.name = subject.name;
    this.isActive = subject.isActive;
    this.description = subject.description;
    this.code = subject.code;
    this.createdAt = subject.createdAt;
    this.updatedAt = subject.updatedAt;

    if (subject.grade) {
      this.grade = new GradeResponseDto(subject.grade);
    }

    if (subject.modules) {
      this.modules = subject.modules.map(
        (module) => new ModuleResponseDto(module),
      );
    }
  }
}
