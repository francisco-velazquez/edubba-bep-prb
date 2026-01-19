import { ChapterOrmEntity } from 'src/app/modules/chapters/infrastructure/entities/chapter-orm.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Unique,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity('student_progress')
@Unique(['userId', 'chapterId'])
export class StudentProgressOrmEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'user_id', type: 'uuid' })
  userId: string;

  @Column({ name: 'chapter_id' })
  chapterId: number;

  @CreateDateColumn({ name: 'completed_at' })
  completedAt: Date;

  @ManyToOne(() => ChapterOrmEntity)
  @JoinColumn({ name: 'chapter_id' })
  chapter: ChapterOrmEntity;
}
