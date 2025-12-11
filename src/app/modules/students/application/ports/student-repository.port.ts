import { Student, StudentId } from '../../domain/student.type';

export const I_STUDENT_REPOSITORY = 'IStudentRepository';

export interface IStudentRepository {
  save(student: Partial<Student>): Promise<Student>;
  
  findAll(): Promise<Student[]>;
  
  findById(id: StudentId): Promise<Student | null>;
  
  // Usaremos softDelete para la baja lógica
  softDelete(id: StudentId): Promise<void>; 
}