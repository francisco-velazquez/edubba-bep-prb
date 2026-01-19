import { Entity, Column, PrimaryColumn, CreateDateColumn } from 'typeorm';

@Entity('student_subject_status')
export class StudentSubjectStatusOrmEntity {
  @PrimaryColumn({ name: 'user_id', type: 'uuid' })
  userId: string;

  @PrimaryColumn({ name: 'subject_id' })
  subjectId: number;

  @CreateDateColumn({ name: 'started_at' })
  startedAt: Date;

  @Column({
    name: 'last_activity_at',
    type: 'timestamp with time zone',
    default: () => 'CURRENT_TIMESTAMP',
  })
  lastActivityAt: Date;

  @Column({
    name: 'finished_at',
    type: 'timestamp with time zone',
    nullable: true,
  })
  finishedAt: Date | null;
}
