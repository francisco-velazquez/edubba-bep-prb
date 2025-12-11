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
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}