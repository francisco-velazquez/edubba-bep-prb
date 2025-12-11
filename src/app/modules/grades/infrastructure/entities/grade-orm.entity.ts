import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { GradeLevel } from "../../domain/grade.type";
import { StudentOrmEntity } from '../../../students/infrastructure/entities/student-orm.entity';

@Entity('academic_grades')
export class GradeOrmEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive: boolean;

  @Column({ type: 'enum', enum: GradeLevel })
  level: GradeLevel;

  @Column({ type: 'varchar', length: 10, unique: true })
  code: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // 🔑 NUEVA PROPIEDAD: Relación inversa a StudentOrmEntity
  @OneToMany(() => StudentOrmEntity, (student) => student.currentGrade)
  students: StudentOrmEntity[];
}