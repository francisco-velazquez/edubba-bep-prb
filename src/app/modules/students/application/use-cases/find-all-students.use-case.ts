import { Injectable, Inject } from '@nestjs/common';
import type { IStudentRepositoryPort } from '../ports/student-repository.port';
import { I_STUDENT_REPOSITORY } from '../ports/student-repository.port';
import { StudentResponseDto } from '../dtos/student-response.dto';

@Injectable()
export class FindAllStudentsUseCase {
  constructor(
    @Inject(I_STUDENT_REPOSITORY)
    private readonly studentRepository: IStudentRepositoryPort,
  ) {}

  /**
   * Obtiene todos los perfiles de estudiantes activos.
   * @returns Un array de entidades Student.
   */
  async execute(): Promise<StudentResponseDto[]> {
    const students = await this.studentRepository.findAll();
    
    // Mapeamos al dto de respuesta
    return students.map(student => new StudentResponseDto(student));
  }
}