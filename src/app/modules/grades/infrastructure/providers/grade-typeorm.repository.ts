import { Injectable } from '@nestjs/common';
import { IGradeRepository } from '../../application/ports/grade-repository.port';
import { InjectRepository } from '@nestjs/typeorm';
import { GradeOrmEntity } from '../entities/grade-orm.entity';
import { Repository } from 'typeorm';
import { Grade } from '../../domain/grade.type';

@Injectable()
export class GradeTypeOrmRepository implements IGradeRepository {
  constructor(
    @InjectRepository(GradeOrmEntity)
    private readonly ormRepository: Repository<GradeOrmEntity>,
  ) {}

  async save(grade: Grade): Promise<Grade> {
    // Convertimos la entidad de dominio a ORM y se guarda
    const gradeOrm = this.ormRepository.create(grade);

    const savedOrm = await this.ormRepository.save(gradeOrm);

    return savedOrm;
  }

  async findAll(): Promise<Grade[]> {
    return this.ormRepository.find();
  }

  async findById(id: number): Promise<Grade | null> {
    const result = await this.ormRepository.findOne({
      where: { id: id },
      relations: ['subjects'],
    });

    if (!result) {
      return null;
    }

    return result;
  }

  async delete(id: number): Promise<void> {
    await this.ormRepository.update(id, {
      isActive: false,
      updatedAt: new Date(),
    });
  }
}
