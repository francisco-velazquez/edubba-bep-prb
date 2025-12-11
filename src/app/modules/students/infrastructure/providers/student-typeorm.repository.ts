import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { IStudentRepository } from '../../application/ports/student-repository.port';
import { StudentOrmEntity } from '../entities/student-orm.entity';
import { Student, StudentId } from '../../domain/student.type';

@Injectable()
export class StudentTypeOrmRepository implements IStudentRepository {
  constructor(
    @InjectRepository(StudentOrmEntity)
    private readonly ormRepository: Repository<StudentOrmEntity>,
  ) {}

  async save(student: Partial<Student>): Promise<Student> {
    const studentOrm = this.ormRepository.create(student);
    const savedOrm = await this.ormRepository.save(studentOrm);
    return savedOrm; 
  }

  async findAll(): Promise<Student[]> {
    return this.ormRepository.find();
  }

  async findById(id: StudentId): Promise<Student | null> {
    return this.ormRepository.findOneBy({ id: id });
  }

  async softDelete(id: StudentId): Promise<void> {
    await this.ormRepository.update(id, { updatedAt: new Date() });
  }
}