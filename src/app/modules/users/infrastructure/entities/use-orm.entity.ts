import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('profiles')
export class UserOrmEntity {
  @PrimaryColumn({ type: 'uuid' })
  id!: string;

  @Column({ type: 'text', nullable: true })
  email!: string;

  @Column({ name: 'first_name', type: 'text', nullable: true })
  firstName!: string;

  @Column({ name: 'last_name', type: 'text', nullable: true })
  lastName!: string;

  @Column({ name: 'password_hash', type: 'text', select: false, nullable: true })
  passwordHash!: string;

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive!: boolean;

  @Column({ name: 'date_of_birth', type: 'date' })
  dateOfBirth: Date;z

  @Column({ name: 'created_at' })
  createdAt!: Date;

  @Column({ name: 'updated_at' })
  updatedAt!: Date;
}
