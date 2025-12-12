import { SubjectOrmEntity } from 'src/app/modules/subjects/infrastructure/entities/subject-orm.entity';
import { UserOrmEntity } from 'src/app/modules/users/infrastructure/entities/use-orm.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  OneToOne,
  PrimaryColumn,
} from 'typeorm';

@Entity('teahers')
export class TeacherOrmEntity {
  @PrimaryColumn({ type: 'uuid', name: 'user_id', unique: true })
  userId: string;

  @Column({ name: 'employee_number', unique: true })
  employeeNumber: string;

  @Column({ name: 'specialty', nullable: true })
  specialty?: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @CreateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relaciones
  @OneToOne(() => UserOrmEntity)
  @JoinColumn({ name: 'user_id' })
  user: UserOrmEntity;

  @ManyToMany(() => SubjectOrmEntity)
  @JoinTable({
    name: 'teacher_subjects',
    joinColumn: { name: 'teacher_id', referencedColumnName: 'userId' },
    inverseJoinColumn: { name: 'subject_id', referencedColumnName: 'id' },
  })
  subjects: SubjectOrmEntity[];
}
