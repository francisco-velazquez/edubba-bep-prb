export interface Option {
  id: number;
  questionId: number;
  optionText: string;
  isCorrect: boolean;
}

export type StudentOption = Omit<Option, 'isCorrect'>;

export interface Question {
  id: number;
  examId: number;
  questionText: string;
  questionType: 'multiple_choice' | 'true_false';
  options?: Option[];
}

export interface StudentQuestion extends Omit<Question, 'options'> {
  options: StudentOption[];
}

export interface Exam {
  id: number;
  title: string;
  moduleId: number;
  questions?: Question[];
}

// Para guardar el intento del alumno
export interface ExamAttempt {
  id?: number;
  userId: string;
  examId: number;
  score: number;
  passed: boolean;
  completedAt: Date;
}

export interface StudentExam extends Omit<Exam, 'questions'> {
  questions: StudentQuestion[];
}

export const I_EXAM_REPOSITORY = Symbol('I_EXAM_REPOSITORY');
