import { Injectable, Inject, BadRequestException } from '@nestjs/common';
import { I_QUESTION_REPOSITORY } from '../../domain/question.entity';
import type { IQuestionRepositoryPort } from '../ports/question-repository.port';
import { CreateQuestionDto } from '../dtos/create-question.dto';
import { QuestionResponseDto } from '../dtos/question-response.dto';

@Injectable()
export class CreateQuestionUseCase {
  constructor(
    @Inject(I_QUESTION_REPOSITORY)
    private readonly questionRepository: IQuestionRepositoryPort,
  ) {}

  async execute(dto: CreateQuestionDto): Promise<QuestionResponseDto> {
    // Validación lógica: solo una respuesta correcta
    const correctAnswers = dto.options.filter((o) => o.isCorrect).length;
    if (correctAnswers !== 1) {
      throw new BadRequestException(
        'A question must have exactly one correct answer.',
      );
    }

    const saved = await this.questionRepository.save(dto);
    return new QuestionResponseDto(saved);
  }
}
