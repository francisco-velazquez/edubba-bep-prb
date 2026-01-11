import { GradeOrmEntity } from 'src/app/modules/grades/infrastructure/entities/grade-orm.entity';
import { ModuleOrmEntity } from 'src/app/modules/modules/infrastructure/entities/module-orm.entity';
import { TeacherOrmEntity } from 'src/app/modules/teachers/infrastructure/entities/teacher-orm.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('subjects')
export class SubjectOrmEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255, unique: true })
  name: string;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @Column({ name: 'grade_id' })
  gradeId: number;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'varchar', unique: true, nullable: true })
  code: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @CreateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relaciones

  // N:1 Un grado tiene muchas materias (Matemáticas 1 pertenece a 1ro Primaria)
  @ManyToOne(() => GradeOrmEntity, (grade) => grade.subjects) // 🔑 CAMBIADO a @ManyToOne
  @JoinColumn({ name: 'grade_id' }) // 🔑 Usamos la columna grade_id, que es la FK
  grade: GradeOrmEntity;

  // N:N Una materia puede ser impartida por muchos maestros
  // La tabla intermedia teachers_subjects ya fue definida en el lado del TeacherOrmEntity
  // Aquí solo declaramos la relación inversa
  @ManyToMany(() => TeacherOrmEntity, (teacher) => teacher.subjects)
  teachers: TeacherOrmEntity[];

  // 1:N Una asignatura tiene muchos módulos (modules)
  @OneToMany(() => ModuleOrmEntity, (module) => module.subject)
  modules: ModuleOrmEntity[];
}
