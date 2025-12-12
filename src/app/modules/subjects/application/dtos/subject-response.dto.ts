import { GradeResponseDto } from 'src/app/modules/grades/application/dtos/grade-response.dto';
import { Subject } from '../../domain/subject.entity';

export class SubjectResponseDto {
  id: number;
  name: string;
  isActive: boolean;
  grade?: GradeResponseDto;

  constructor(subject: Subject) {
    this.id = subject.id;
    this.name = subject.name;
    this.isActive = subject.isActive;

    if (subject.grade) {
      this.grade = new GradeResponseDto(subject.grade);
    }
  }
}
