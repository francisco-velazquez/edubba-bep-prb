import { Injectable, Inject } from '@nestjs/common';
import { I_QUESTION_REPOSITORY } from '../../domain/question.entity';
import type { IQuestionRepositoryPort } from '../ports/question-repository.port';

@Injectable()
export class DeleteQuestionUseCase {
  constructor(
    @Inject(I_QUESTION_REPOSITORY)
    private readonly questionRepository: IQuestionRepositoryPort,
  ) {}

  async execute(id: number): Promise<boolean> {
    const question = await this.questionRepository.findById(id);
    if (!question) {
      return false;
    }

    await this.questionRepository.delete(id);

    return true;
  }
}
