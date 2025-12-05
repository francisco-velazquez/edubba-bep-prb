import { User } from '../entities/user.entity';

export interface IUserRepositoryPort {
  // Se usará en el módulo Auth para validar credenciales
  findByEmail(email: string): Promise<User | null>;

  // Métodos básicos de gestión de usuarios
  findAll(): Promise<User[]>;
  findAllActive(): Promise<User[]>;
  findById(id: string): Promise<User | null>;
  save(user: User): Promise<User>;
  update(id: string, user: Partial<User>): Promise<User>;
  delete(id: string): Promise<void>;
}
