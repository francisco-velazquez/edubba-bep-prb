import { Grade } from '../../grades/domain/grade.type';
import { Module } from '../../modules/domain/module.entity';
import { Teacher } from '../../teachers/domain/teacher.entity';

export interface Subject {
  id: number;
  name: string;
  isActive: boolean;

  gradeId: number;
  grade?: Grade;
  modules?: Module[];

  teachers?: Teacher[];

  description?: string;
  code?: string;

  createdAt: Date;
  updatedAt: Date;
}

export const I_SUBJECT_REPOSITORY = Symbol('ISubjectRepository');
