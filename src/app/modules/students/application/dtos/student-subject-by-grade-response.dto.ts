import { SubjectResponseDto } from 'src/app/modules/subjects/application/dtos/subject-response.dto';

export class StudentSubjectByGradeResponseDto {
  studentId: string;
  subjects: SubjectResponseDto[];

  constructor(studentId: string, subjects: SubjectResponseDto[]) {
    this.studentId = studentId;
    this.subjects = subjects;
  }
}
