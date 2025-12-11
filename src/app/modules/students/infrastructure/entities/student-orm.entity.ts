import { Entity, Column, PrimaryColumn, CreateDateColumn, UpdateDateColumn, JoinColumn, OneToOne, ManyToOne } from 'typeorm';
import { GradeOrmEntity } from '../../../grades/infrastructure/entities/grade-orm.entity'; // Dependencia
import { UserOrmEntity } from 'src/app/modules/users/infrastructure/entities/use-orm.entity';

@Entity('students') // Nombre de la tabla en la base de datos
export class StudentOrmEntity {
  @PrimaryColumn({ type: 'uuid', name: 'user_id' })
  id: string; // Relación 1:1 con User

  @Column({ name: 'enrollment_code', unique: true })
  enrollmentCode: string;
  
  @Column({ name: 'current_grade_id', nullable: true })
  currentGradeId: number | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // 🔑 RELACIONES

  // Relación 1:1 con la tabla users/profiles
  @OneToOne(() => UserOrmEntity)
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  user: UserOrmEntity; 
  
  // Relación N:1 con la tabla grades
  @ManyToOne(() => GradeOrmEntity, (grade) => grade.students)
  @JoinColumn({ name: 'current_grade_id' })
  currentGrade: GradeOrmEntity;
}