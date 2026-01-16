import { GradeResponseDto } from 'src/app/modules/grades/application/dtos/grade-response.dto';
import { SubjectResponseDto } from 'src/app/modules/subjects/application/dtos/subject-response.dto';

export class StudentSubjectByGradeResponseDto {
  studentId: string;
  currentGrade: GradeResponseDto;
  subjects: SubjectResponseDto[];

  constructor(
    studentId: string,
    currentGrade: GradeResponseDto,
    subjects: SubjectResponseDto[],
  ) {
    this.studentId = studentId;
    this.currentGrade = currentGrade;
    this.subjects = subjects;
  }
}
