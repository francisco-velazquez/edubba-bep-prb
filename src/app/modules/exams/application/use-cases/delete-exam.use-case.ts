import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { I_EXAM_REPOSITORY } from '../../domain/entities/exam.entity';
import type { IExamRepositoryPort } from '../../domain/ports/exam-repository.port';

@Injectable()
export class DeleteExamUseCase {
  constructor(
    @Inject(I_EXAM_REPOSITORY)
    private readonly examRepository: IExamRepositoryPort,
  ) {}

  async execute(id: number): Promise<boolean> {
    const exists = await this.examRepository.findById(id);

    if (!exists) {
      throw new NotFoundException(`Exam with id ${id} not found`);
    }

    await this.examRepository.deleteExam(id);

    return true;
  }
}
