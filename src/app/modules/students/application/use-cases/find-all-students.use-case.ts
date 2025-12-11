import { Injectable, Inject } from '@nestjs/common';
import * as studentRepositoryPort from '../ports/student-repository.port';
import { Student } from '../../domain/student.type';

@Injectable()
export class FindAllStudentsUseCase {
  constructor(
    @Inject(studentRepositoryPort.I_STUDENT_REPOSITORY)
    private readonly studentRepository: studentRepositoryPort.IStudentRepository,
  ) {}

  /**
   * Obtiene todos los perfiles de estudiantes activos.
   * @returns Un array de entidades Student.
   */
  async execute(): Promise<Student[]> {
    // El repositorio se encarga de filtrar por 'isActive: true'
    return this.studentRepository.findAll();
  }
}