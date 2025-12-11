import { Grade } from "../../grades/domain/grade.type";
import { User } from "../../users/domain/entities/user.entity";

export type StudentId = string; // UUID heredado de User
export type GradeId = number; // ID del Grado Académico

export interface Student {
  /** ID del usuario principal (relación 1:1 con la tabla users/profiles) */
  userId: StudentId;

  /** Código o número de matrícula del estudiante */
  enrollmentCode: string;

  /** Grado académico actual (Foreign Key a Grades) */
  currentGradeId: number;
  
  currentGrade?: Grade;
  userProfile?: User;

  createdAt: Date;
  updatedAt: Date;
}

export const I_STUDENT_REPOSITORY = Symbol('IStudentRepository');