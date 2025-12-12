import { SubjectOrmEntity } from 'src/app/modules/subjects/infrastructure/entities/subject-orm.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('modules')
export class ModuleOrmEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100, nullable: false })
  title: string;

  @Column({ name: 'order_index', default: 0, type: 'int', nullable: false })
  orderIndex: number;

  @Column({ name: 'is_published', type: 'boolean', default: false })
  isPublished: boolean;

  @Column({ name: 'subject_id', type: 'int', nullable: false })
  subjectId: number;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @CreateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;

  // Relaciones

  // N:1 Muchos módulos pertenecen a una asignagura
  @ManyToOne(() => SubjectOrmEntity, (suject) => suject.modules)
  @JoinColumn({ name: 'subject_id' })
  subject: SubjectOrmEntity;

  // 1:N Un módulo tiene muchos Capitulos (chapters)
  // @OneToMany(() => ChapterOrmEntity, chapter => chapter.module)
  // chapters: ChapterOrmEntity[];
}
