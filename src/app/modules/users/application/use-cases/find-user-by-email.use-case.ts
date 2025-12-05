import { Inject, Injectable } from '@nestjs/common';
import type { IUserRepositoryPort } from '../../domain/ports/user-repository.port';
import { UserResponseDto } from '../dtos/user-response.dto';
import { User } from '../../domain/entities/user.entity';

@Injectable()
export class FindUserByEmailUseCase {
  constructor(
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepositoryPort,
  ) {}

  async execute(email: string) {
    const user = await this.userRepository.findByEmail(email);

    if (!user || !user.isActive) {
      return null;
    }

    // Aquí se puede ir agregando la lógica de negocio que sea necesaria
    return new UserResponseDto(user);
  }

  // Este método es para Auth, que necesita la entidad completa incluyendo la contraseña hasheada
  async executeForAuth(email: string): Promise<User | null> {
    return this.userRepository.findByEmail(email);
  }
}
