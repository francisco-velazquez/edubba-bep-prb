import { GradeResponseDto } from "src/app/modules/grades/application/dtos/grade-response.dto";
import { Student } from "../../domain/student.entity";
import { userProfileDto } from "src/app/modules/users/application/dtos/user-profile.dto";

export class StudentResponseDto {
  userId: string;
  enrollmentCode: string;
  currentGradeId: number;

  cureentGrade: GradeResponseDto; //Crearlo
  user: userProfileDto;

  constructor(student: Student) {
    this.userId = student.userId;
    this.enrollmentCode = student.enrollmentCode;
    this.currentGradeId = this.currentGradeId;

    if(student.userProfile) {
      this.user = new userProfileDto(student.userProfile);
    } else {
      this.user = {} as userProfileDto;
    }

    if(student.currentGrade) {
      this.cureentGrade = new GradeResponseDto(student.currentGrade);
    }
  }
}