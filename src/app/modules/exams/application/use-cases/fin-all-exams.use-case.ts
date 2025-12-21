import { Inject, Injectable } from '@nestjs/common';
import { I_EXAM_REPOSITORY } from '../../domain/exam.entity';
import type { IExamRepositoryPort } from '../ports/exam-repository.port';
import { ExamResponseDto } from '../dtos/exam-response.dto';

@Injectable()
export class FindAllExamsUseCase {
  constructor(
    @Inject(I_EXAM_REPOSITORY)
    private readonly examRepository: IExamRepositoryPort,
  ) {}

  async execute(): Promise<ExamResponseDto[]> {
    const exams = await this.examRepository.findAll();

    return exams.map((exam) => new ExamResponseDto(exam));
  }
}
