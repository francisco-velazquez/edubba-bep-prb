import {
  Injectable,
  Inject,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { I_QUESTION_REPOSITORY } from '../../domain/question.entity';
import type { IQuestionRepositoryPort } from '../ports/question-repository.port';
import { UpdateQuestionDto } from '../dtos/update-question.dto';
import { QuestionResponseDto } from '../dtos/question-response.dto';

@Injectable()
export class UpdateQuestionUseCase {
  constructor(
    @Inject(I_QUESTION_REPOSITORY)
    private readonly questionRepository: IQuestionRepositoryPort,
  ) {}

  async execute(
    id: number,
    dto: UpdateQuestionDto,
  ): Promise<QuestionResponseDto> {
    const existingQuestion = await this.questionRepository.findById(id);
    if (!existingQuestion) {
      throw new NotFoundException(`Question with ID ${id} not found.`);
    }

    // Si se envían opciones, validar que haya exactamente una correcta
    if (dto.options) {
      const correctAnswers = dto.options.filter((o) => o.isCorrect).length;
      if (correctAnswers !== 1) {
        throw new BadRequestException(
          'A question must have exactly one correct answer.',
        );
      }
    }

    // El repositorio se encargará de la persistencia de las opciones gracias al cascade: true
    const updated = await this.questionRepository.save({
      ...existingQuestion,
      ...dto,
      id,
    });

    return new QuestionResponseDto(updated);
  }
}
