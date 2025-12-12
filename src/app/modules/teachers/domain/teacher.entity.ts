import { SubjectOrmEntity } from '../../subjects/infrastructure/entities/subject-orm.entity';
import { User } from '../../users/domain/entities/user.entity';

export interface Teacher {
  userId: string;
  employeeNumber: string;
  specialty?: string;

  // Relaciones
  userProfile?: User;
  subjects: SubjectOrmEntity[];

  createdAt: Date;
  updatedAt: Date;
}

export const I_TEACHER_REPOSITORY = 'I_TEACHER_REPOSITORY';
