import { Injectable, Inject } from '@nestjs/common';
import { I_QUESTION_REPOSITORY } from '../../domain/question.entity';
import type { IQuestionRepositoryPort } from '../ports/question-repository.port';
import { QuestionResponseDto } from '../dtos/question-response.dto';

@Injectable()
export class FindQuestionsByExamUseCase {
  constructor(
    @Inject(I_QUESTION_REPOSITORY)
    private readonly questionRepository: IQuestionRepositoryPort,
  ) {}

  async execute(examId: number): Promise<QuestionResponseDto[]> {
    const questions = await this.questionRepository.findByExamId(examId);
    return questions.map((q) => new QuestionResponseDto(q));
  }
}
