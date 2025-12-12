import { Inject, Injectable } from '@nestjs/common';
import { I_GRADE_REPOSITORY } from '../ports/grade-repository.port';
import type { IGradeRepository } from '../ports/grade-repository.port';
import { Grade } from '../../domain/grade.type';

@Injectable()
export class FindAllGradesUseCase {
  constructor(
    @Inject(I_GRADE_REPOSITORY)
    private readonly gradeRepository: IGradeRepository,
  ) {}

  async execute(): Promise<Grade[]> {
    return this.gradeRepository.findAll();
  }
}
