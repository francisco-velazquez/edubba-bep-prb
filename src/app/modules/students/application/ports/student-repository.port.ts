import { Student } from '../../domain/student.entity';

export interface IStudentRepositoryPort {
  save(student: Student): Promise<Student>;

  findAll(): Promise<Student[]>;

  findById(userId: string): Promise<Student | null>;

  // Usaremos softDelete para la baja lógica
  updateGrade(userId: string, gradeId: number): Promise<Student>;
}

export function I_STUDENT_REPOSITORY(): (
  target: typeof import('../use-cases/create-student.use-case').CreateStudentUseCase,
  propertyKey: undefined,
  parameterIndex: 0,
) => void {
  throw new Error('Function not implemented.');
}
