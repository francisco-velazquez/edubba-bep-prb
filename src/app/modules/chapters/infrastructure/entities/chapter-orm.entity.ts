import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ModuleOrmEntity } from 'src/app/modules/modules/infrastructure/entities/module-orm.entity';

@Entity('chapters')
export class ChapterOrmEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar' })
  title: string;

  @Column({ name: 'video_url', nullable: false })
  videoUrl: string;

  @Column({ name: 'content_url', nullable: true })
  contentUrl: string;

  @Column({ name: 'order_index', default: 0 })
  orderIndex: number;

  @Column({ name: 'is_published', default: false })
  isPublished: boolean;

  @Column({ name: 'module_id' })
  moduleId: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @CreateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relaciones

  // N:1 Muchos capítulos pertenecen a un módulo
  @ManyToOne(() => ModuleOrmEntity, (module) => module.chapters)
  @JoinColumn({ name: 'module_id' })
  module: ModuleOrmEntity;
}
