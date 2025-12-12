import { SubjectResponseDto } from 'src/app/modules/subjects/application/dtos/subject-response.dto';
import { Grade, GradeLevel } from '../../domain/grade.type';

export class GradeResponseDto {
  id: number;
  name: string;
  level: GradeLevel;
  code: string;
  isActive: boolean;

  // Propiedad para realizar la relación con subjects
  subjects?: SubjectResponseDto[];

  constructor(grade: Grade) {
    this.id = grade.id;
    this.name = grade.name;
    this.level = grade.level;
    this.code = grade.code;
    this.isActive = grade.isActive;

    if (grade.subjects) {
      this.subjects = grade.subjects.map(
        (subject) => new SubjectResponseDto(subject),
      );
    }
  }
}
