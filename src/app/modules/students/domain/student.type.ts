export type StudentId = string; // UUID heredado de User
export type GradeId = number; // ID del Grado Académico

export interface Student {
  /** ID del usuario principal (relación 1:1 con la tabla users/profiles) */
  id: StudentId;

  /** Código o número de matrícula del estudiante */
  enrollmentCode: string;

  /** Grado académico actual (Foreign Key a Grades) */
  currentGradeId: GradeId | null;

  createdAt: Date;
  updatedAt: Date;
}