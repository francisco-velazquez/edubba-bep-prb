import { Option } from './option.entity';

export enum QuestionType {
  MULTIPLE_CHOICE = 'multiple_choice',
  TRUE_FALSE = 'true_false',
}

export interface Question {
  id: number;
  examId: number;
  questionText: string;
  questionType: QuestionType;
  options: Option[];
}

export const I_QUESTION_REPOSITORY = Symbol('IQuestionRepository');
