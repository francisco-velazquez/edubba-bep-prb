import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ITeacherRepositoryPort } from '../../application/ports/teacher-repository.port';
import { TeacherOrmEntity } from '../entities/teacher-orm.entity';
import { Teacher } from '../../domain/teacher.entity';
import { SubjectOrmEntity } from 'src/app/modules/subjects/infrastructure/entities/subject-orm.entity';
import { AssignSubjectsDto } from '../../application/dtos/assign-subjects.dto';

@Injectable()
export class TeacherTypeOrmRepository implements ITeacherRepositoryPort {
  constructor(
    @InjectRepository(TeacherOrmEntity)
    private readonly ormRepository: Repository<TeacherOrmEntity>,
  ) {}

  // --- MAPPERS ---
  private toDomain(orm: TeacherOrmEntity): Teacher {
    return {
      userId: orm.userId,
      employeeNumber: orm.employeeNumber,
      specialty: orm.specialty,
      userProfile: orm.user,
      subjects: orm.subjects, // TypeORM devolverá las entidades Subject aquí
      createdAt: orm.createdAt,
      updatedAt: orm.updatedAt,
    };
  }

  // --- IMPLEMENTACIÓN ---
  async save(teacher: Teacher): Promise<Teacher> {
    const orm = this.ormRepository.create({
      userId: teacher.userId,
      employeeNumber: teacher.employeeNumber,
      specialty: teacher.specialty,
    });

    const saved = await this.ormRepository.save(orm);

    return this.findById(saved.userId) as Promise<Teacher>;
  }

  async findAll(): Promise<Teacher[]> {
    const result = await this.ormRepository.find({
      relations: ['user', 'subjects'],
    });

    return result.map((orm) => this.toDomain(orm));
  }

  async findById(userId: string): Promise<Teacher | null> {
    const result = await this.ormRepository.findOne({
      where: { userId },
      relations: ['user', 'subjects'],
    });

    return result ? this.toDomain(result) : null;
  }

  async assignSubjects(
    userId: string,
    subjectIds: AssignSubjectsDto,
  ): Promise<Teacher> {
    // TypeORM maneja las relaciones ManyToMany manipulando el array de objetos
    const teacher = await this.ormRepository.findOne({
      where: { userId },
      relations: ['subjects'],
    });

    if (!teacher) {
      throw new NotFoundException('Teacher not found');
    }

    // Creamos instancias parciales de Subjects solo con el ID para que
    // TypeORM haga el enlace
    const newSubjects = subjectIds.subjectIds.map((id) => {
      const s = new SubjectOrmEntity();
      s.id = id;
      return s;
    });

    teacher.subjects = newSubjects; // Reemplaza las materias existentes
    await this.ormRepository.save(teacher);

    return this.findById(userId) as Promise<Teacher>;
  }

  async updateGeneralInfo(
    userId: string,
    teacherData: Partial<Teacher>,
  ): Promise<Teacher> {
    const updateData: Partial<TeacherOrmEntity> = {
      updatedAt: new Date(),
    };

    if (teacherData.employeeNumber !== undefined) {
      updateData.employeeNumber = teacherData.employeeNumber;
    }

    const result = await this.ormRepository.update({ userId }, updateData);
    if (result.affected === 0) {
      throw new NotFoundException(`Teacher with ID ${userId} not found.`);
    }

    // Obtener la entidad actualizada con las relaciones
    const updatedTeacher = await this.findById(userId);

    if (!updatedTeacher) {
      throw new NotFoundException(
        `Failed to retrieve updated teacher with ID ${userId}`,
      );
    }

    return updatedTeacher;
  }
}
