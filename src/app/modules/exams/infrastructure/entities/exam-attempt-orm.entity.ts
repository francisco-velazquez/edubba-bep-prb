import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ExamOrmEntity } from './exam-orm.entity';
import { StudentOrmEntity } from 'src/app/modules/students/infrastructure/entities/student-orm.entity';

@Entity('exam_attempts')
export class ExamAttemptOrmEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'user_id', type: 'uuid' })
  userId: string;

  @Column({ name: 'exam_id' })
  examId: number;

  @Column({ type: 'integer' })
  score: number; // Valor de 0 a 100

  @Column({ type: 'boolean' })
  passed: boolean;

  @CreateDateColumn({ name: 'completed_at', type: 'timestamp with time zone' })
  completedAt: Date;

  // Relaciones
  @ManyToOne(() => ExamOrmEntity)
  @JoinColumn({ name: 'exam_id' })
  exam: ExamOrmEntity;

  // Nota: Si tienes una entidad StudentOrmEntity, podrías relacionarla aquí también:
  @ManyToOne(() => StudentOrmEntity)
  @JoinColumn({ name: 'user_id' })
  student: StudentOrmEntity;
}
