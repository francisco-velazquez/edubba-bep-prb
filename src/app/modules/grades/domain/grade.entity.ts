import { Grade, GradeLevel } from './grade.type';

export class GradeEntity implements Grade {
  id: number;
  name: string;
  level: GradeLevel;
  code: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;

  constructor(data: Omit<Grade, 'id' | 'createdAt' | 'updatedAt'>) {
    this.name = data.name;
    this.level = data.level;
    this.code = data.code;
    this.isActive = data.isActive;
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }
}
