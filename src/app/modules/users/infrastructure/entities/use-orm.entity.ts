import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('profiles')
export class UserOrmEntity {
  @PrimaryColumn({ type: 'uuid' })
  id!: string;

  @Column({ type: 'text', nullable: true })
  email!: string;

  @Column({ name: 'full_name', type: 'text', nullable: true })
  fullName!: string;

  @Column({ name: 'password_hash', type: 'text', select: false, nullable: true })
  passwordHash!: string;

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive!: boolean;

  @Column({ name: 'current_grade_id', type: 'int' })
  currentGradeId!: number;

  // El rol se obtendrá a través de una consulta JOIN o una View, no de esta columna directamente
  // ya que está en la tabla 'user_roles'. Para simplificar la inyección, TypeORM cargará el rol en el Repositorio.

  @Column({ name: 'created_at' })
  createdAt!: Date;

  @Column({ name: 'updated_at' })
  updatedAt!: Date;
}
