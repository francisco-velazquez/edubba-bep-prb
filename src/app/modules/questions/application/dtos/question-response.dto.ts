import { Question } from '../../domain/question.entity';
import { OptionResponseDto } from './option-response.dto';

export class QuestionResponseDto {
  id: number;
  examId: number;
  questionText: string;
  questionType: string;
  options: OptionResponseDto[];

  constructor(orm: Question) {
    this.id = orm.id;
    this.examId = orm.examId;
    this.questionText = orm.questionText;
    this.questionType = orm.questionType;
    this.options = orm.options
      ? orm.options.map((o) => new OptionResponseDto(o))
      : [];
  }
}
