import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { OptionOrmEntity } from './option-orm.entity';
import { QuestionType } from '../../domain/question.entity';
import { ExamOrmEntity } from 'src/app/modules/exams/infrastructure/entities/exam-orm.entity';

@Entity('questions')
export class QuestionOrmEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'exam_id' })
  examId: number;

  @Column({ name: 'question_text', type: 'text' })
  questionText: string;

  @Column({ name: 'question_type', type: 'text' })
  questionType: QuestionType;

  @ManyToOne(() => ExamOrmEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'exam_id' })
  exam: ExamOrmEntity;

  @OneToMany(() => OptionOrmEntity, (option) => option.question, {
    cascade: true,
  })
  options: OptionOrmEntity[];
}
