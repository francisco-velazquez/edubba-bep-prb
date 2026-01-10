import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { StudentOrmEntity } from '../entities/student-orm.entity';
import { Student } from '../../domain/student.entity';
import { IStudentRepositoryPort } from '../../application/ports/student-repository.port';

@Injectable()
export class StudentTypeOrmRepository implements IStudentRepositoryPort {
  constructor(
    @InjectRepository(StudentOrmEntity)
    private readonly studentRepository: Repository<StudentOrmEntity>,
  ) {}

  // =======================================================================
  // UTILITIES (Mapeo)
  // =======================================================================

  private toOrmEntity(student: Student): StudentOrmEntity {
    const orm = new StudentOrmEntity();
    orm.userId = student.userId;
    orm.enrollmentCode = student.enrollmentCode;
    orm.currentGradeId = student.currentGradeId || null;
    orm.createdAt = student.createdAt;
    orm.updatedAt = new Date();
    return orm;
  }

  private toDomainEntity(ormStudent: StudentOrmEntity): Student {
    return {
      userId: ormStudent.userId,
      enrollmentCode: ormStudent.enrollmentCode,
      currentGradeId: ormStudent.currentGradeId || 0,
      currentGrade: ormStudent.currentGrade, // Se incluye la relación si se carga
      userProfile: ormStudent.user,
      createdAt: ormStudent.createdAt,
      updatedAt: ormStudent.updatedAt,
    };
  }

  // =======================================================================
  // INTERFACE IMPLEMENTATION
  // =======================================================================

  async save(student: Student): Promise<Student> {
    const ormStudent = this.toOrmEntity(student);
    try {
      // Usar save() para crear o actualizar.
      const savedOrm = await this.studentRepository.save(ormStudent);
      return this.toDomainEntity(savedOrm);
    } catch (error) {
      // Manejar errores de clave duplicada (enrollmentCode) o FK
      throw new InternalServerErrorException(
        'Error saving student profile.',
        (error as Error).message,
      );
    }
  }

  async findAll(): Promise<Student[]> {
    // Cargar la relación 'currentGrade' para el DTO
    const ormStudents = await this.studentRepository.find({
      relations: ['currentGrade', 'user'],
      order: { enrollmentCode: 'ASC' },
    });

    return ormStudents.map((ormStudent) => this.toDomainEntity(ormStudent));
  }

  async findById(userId: string): Promise<Student | null> {
    const ormStudent = await this.studentRepository.findOne({
      where: { userId },
      relations: ['currentGrade', 'user'],
    });

    if (!ormStudent) {
      return null;
    }
    return this.toDomainEntity(ormStudent);
  }

  async updateGrade(userId: string, gradeId: number): Promise<Student> {
    const result = await this.studentRepository.update(
      { userId },
      { currentGradeId: gradeId, updatedAt: new Date() },
    );

    if (result.affected === 0) {
      throw new NotFoundException(`Student with ID ${userId} not found.`);
    }

    // Obtener la entidad actualizada con las relaciones
    const updatedStudent = await this.findById(userId);

    if (!updatedStudent) {
      throw new InternalServerErrorException(
        'Failed to retrieve updated student.',
      );
    }
    return updatedStudent;
  }

  async updateGeneralInfo(
    userId: string,
    studentData: Partial<Student>,
  ): Promise<Student> {
    const updateData: Partial<StudentOrmEntity> = {
      updatedAt: new Date(),
    };

    if (studentData.enrollmentCode !== undefined) {
      updateData.enrollmentCode = studentData.enrollmentCode;
    }
    if (studentData.currentGradeId !== undefined) {
      updateData.currentGradeId = studentData.currentGradeId;
    }

    const result = await this.studentRepository.update({ userId }, updateData);

    if (result.affected === 0) {
      throw new NotFoundException(`Student with ID ${userId} not found.`);
    }

    // Obtener la entidad actualizada con las relaciones
    const updatedStudent = await this.findById(userId);

    if (!updatedStudent) {
      throw new InternalServerErrorException(
        'Failed to retrieve updated student.',
      );
    }

    return updatedStudent;
  }
}
