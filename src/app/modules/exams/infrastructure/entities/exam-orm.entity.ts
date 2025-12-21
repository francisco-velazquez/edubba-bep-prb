import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ModuleOrmEntity } from 'src/app/modules/modules/infrastructure/entities/module-orm.entity';

@Entity('exams')
export class ExamOrmEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar' })
  title: string;

  @Column({ name: 'module_id' })
  moduleId: number;

  // Relaciones

  // 1:1 Un examen pertenece a un capitulo
  @ManyToOne(() => ModuleOrmEntity, (module) => module.exams)
  @JoinColumn({ name: 'module_id' })
  module: ModuleOrmEntity;

  // 1:N Un examen tiene muchas preguntas
  // @OneToMany(() => QuestionOrmEntity, (question) => question.exam)
  // questions: QuestionOrmEntity[];
}
