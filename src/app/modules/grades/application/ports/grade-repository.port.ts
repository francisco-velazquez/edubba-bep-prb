import { Grade } from '../../domain/grade.type';

export const I_GRADE_REPOSITORY = 'IGradeRepository';

export interface IGradeRepository {
  // Guarda o actualiza un grado
  save(grade: Partial<Grade> & { id?: number }): Promise<Grade>;

  // Devuelve todos los grados
  findAll(): Promise<Grade[]>;

  // Devuelve un grado en especifico
  findById(id: number): Promise<Grade | null>;

  // Elmina un grado (desactiva) en base a un id
  delete(id: number): Promise<void>;
}
