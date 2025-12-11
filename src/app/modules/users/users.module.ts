import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserOrmEntity } from './infrastructure/entities/use-orm.entity';
import { FindUserByEmailUseCase } from './application/use-cases/find-user-by-email.use-case';
import { UserTypeOrmRepository } from './infrastructure/providers/user-typeorm.repository';
import { CreateUserUseCase } from './application/use-cases/create-user.use-case';
import { I_USER_REPOSITORY } from './domain/ports/user-repository.port';

@Module({
  imports: [TypeOrmModule.forFeature([UserOrmEntity])], //Se registran las entidades de TypeORM (mapeo a la tabla 'profiles')
  providers: [
    // Se registran los casos de uso y repositorios aquí
    FindUserByEmailUseCase,
    CreateUserUseCase,
    // Se registra el Repositorio (Implementacion del Port)
    {
      provide: I_USER_REPOSITORY,
      useClass: UserTypeOrmRepository,
    },
  ],
  controllers: [],
  exports: [
    FindUserByEmailUseCase, 
    I_USER_REPOSITORY,
    CreateUserUseCase,
  ],
})
export class UsersModule {}
