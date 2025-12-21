import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { I_EXAM_REPOSITORY } from '../../domain/exam.entity';
import type { IExamRepositoryPort } from '../ports/exam-repository.port';
import { ExamResponseDto } from '../dtos/exam-response.dto';

@Injectable()
export class FindExamByIdUseCase {
  constructor(
    @Inject(I_EXAM_REPOSITORY)
    private readonly examRepository: IExamRepositoryPort,
  ) {}

  async execute(id: number): Promise<ExamResponseDto> {
    const exam = await this.examRepository.findById(id);

    if (!exam) throw new NotFoundException('Exam not found');

    return new ExamResponseDto(exam);
  }
}
