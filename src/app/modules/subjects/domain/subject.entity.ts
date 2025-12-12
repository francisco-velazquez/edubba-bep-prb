import { Grade } from '../../grades/domain/grade.type';
import { Teacher } from '../../teachers/domain/teacher.entity';

export interface Subject {
  id: number;
  name: string;
  isActive: boolean;

  gradeId: number;
  grade?: Grade;

  teachers?: Teacher[];

  createdAt: Date;
  updatedAt: Date;
}

export const I_SUBJECT_REPOSITORY = Symbol('ISubjectRepository');
