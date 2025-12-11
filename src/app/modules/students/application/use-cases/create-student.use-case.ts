import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import * as studentRepositoryPort from '../ports/student-repository.port';
import { CreateStudentDto } from '../dtos/create-student.dto';
import { Student } from '../../domain/student.type';

@Injectable()
export class CreateStudentUseCase {
  constructor(
    @Inject(studentRepositoryPort.I_STUDENT_REPOSITORY)
    private readonly studentRepository: studentRepositoryPort.IStudentRepository,
    // Aquí se inyectaría el FindUserByIdUseCase del UsersModule para verificar
    // que el userId existe antes de crear la entidad Student.
    // private readonly findUserByIdUseCase: FindUserByIdUseCase, 
  ) {}

  async execute(dto: CreateStudentDto): Promise<Student> {
    // 1. (PENDIENTE) Verificar que el userId y el currentGradeId existan.

    const newStudent: Student = {
      id: dto.userId, // El ID del Student es el mismo que el ID del User
      enrollmentCode: dto.enrollmentCode,
      currentGradeId: dto.currentGradeId || null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    return this.studentRepository.save(newStudent);
  }
}