import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { I_EXAM_REPOSITORY } from '../../domain/exam.entity';
import type { IExamRepositoryPort } from '../ports/exam-repository.port';
import { ExamResponseDto } from '../dtos/exam-response.dto';

@Injectable()
export class FindExamByModuleUseCase {
  constructor(
    @Inject(I_EXAM_REPOSITORY)
    private readonly examRepository: IExamRepositoryPort,
  ) {}

  async execute(moduleId: number): Promise<ExamResponseDto> {
    const exam = await this.examRepository.findByModuleId(moduleId);

    if (!exam) {
      throw new NotFoundException(`Exam for module Id ${moduleId} not found`);
    }

    return new ExamResponseDto(exam);
  }
}
