import { userProfileDto } from 'src/app/modules/users/application/dtos/user-profile.dto';
import { Teacher } from '../../domain/teacher.entity';
import { SubjectOrmEntity } from 'src/app/modules/subjects/infrastructure/entities/subject-orm.entity';

export class TeacherResponseDto {
  userId: string;
  employeeNumber: string;
  specialty?: string;
  user: userProfileDto;
  subjects: SubjectOrmEntity[];
  createdAt: Date;
  updatedAt: Date;

  constructor(teacher: Teacher) {
    this.userId = teacher.userId;
    this.employeeNumber = teacher.employeeNumber;
    this.specialty = teacher.specialty;

    if (teacher.userProfile) {
      this.user = new userProfileDto(teacher.userProfile);
    }

    if (teacher.subjects) {
      this.subjects = teacher.subjects;
    }

    this.createdAt = teacher.createdAt;
    this.updatedAt = teacher.updatedAt;
  }
}
