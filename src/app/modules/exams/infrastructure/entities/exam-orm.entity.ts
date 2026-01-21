import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity('exams')
export class ExamOrmEntity {
  @PrimaryGeneratedColumn() id: number;
  @Column() title: string;
  @Column({ name: 'module_id' }) moduleId: number;
  @OneToMany(() => QuestionOrmEntity, (q) => q.exam, { cascade: true })
  questions: QuestionOrmEntity[];
}

@Entity('questions')
export class QuestionOrmEntity {
  @PrimaryGeneratedColumn() id: number;
  @Column({ name: 'question_text', type: 'text' }) questionText: string;
  @Column({ name: 'question_type' }) questionType:
    | 'multiple_choice'
    | 'true_false';
  @ManyToOne(() => ExamOrmEntity, (e) => e.questions)
  @JoinColumn({ name: 'exam_id' })
  exam: ExamOrmEntity;
  @OneToMany(() => OptionOrmEntity, (o) => o.question, { cascade: true })
  options: OptionOrmEntity[];
}

@Entity('options')
export class OptionOrmEntity {
  @PrimaryGeneratedColumn() id: number;
  @Column({ name: 'option_text' }) optionText: string;
  @Column({ name: 'is_correct', default: false }) isCorrect: boolean;
  @ManyToOne(() => QuestionOrmEntity, (q) => q.options)
  @JoinColumn({ name: 'question_id' })
  question: QuestionOrmEntity;
}
