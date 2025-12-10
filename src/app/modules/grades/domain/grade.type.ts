export enum GradeLevel {
  PRIMARY = 'PRIMARY',
  SECONDARY = 'SECONDARY',
  HIGH_SCHOOL = 'HIGH_SCHOOL'
}

export interface Grade {
  id: number;
  name: string;
  level: GradeLevel,
  code: string;
  createdAt: Date;
  updatedAt: Date;
}