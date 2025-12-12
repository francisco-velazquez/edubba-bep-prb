import { Subject } from '../../subjects/domain/subject.entity';

export enum GradeLevel {
  PRIMARY = 'PRIMARY',
  SECONDARY = 'SECONDARY',
  HIGH_SCHOOL = 'HIGH_SCHOOL',
}

export interface Grade {
  id: number;
  name: string;
  level: GradeLevel;
  code: string;
  isActive: boolean;

  // Sirve para la realacion con las materias
  subjects?: Subject[];

  createdAt: Date;
  updatedAt: Date;
}
