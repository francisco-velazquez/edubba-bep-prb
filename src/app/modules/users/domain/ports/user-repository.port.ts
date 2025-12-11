import { CreateUserDto } from 'src/app/modules/users/application/dtos/create-user.dto';
import { User } from '../entities/user.entity';

// Token para inyección de dependencia
export const I_USER_REPOSITORY = Symbol('IUserRepository');

export interface IUserRepositoryPort {
  create(data: Omit<User, 'id' | 'createdAt' | 'updatedAt' | 'isActive'> & { passwordHash: string }): Promise<User>;
  findByEmail(email: string): Promise<User | null>;

  // Métodos básicos de gestión de usuarios
  findAll(): Promise<User[]>;
  findAllActive(): Promise<User[]>;
  findById(id: string): Promise<User | null>;
  save(user: User): Promise<User>;
  update(id: string, user: Partial<User>): Promise<User>;
  delete(id: string): Promise<void>;
}
