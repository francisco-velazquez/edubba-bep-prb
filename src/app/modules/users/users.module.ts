import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserOrmEntity } from './infrastructure/entities/use-orm.entity';
import { FindUserByEmailUseCase } from './application/use-cases/find-user-by-email.use-case';
import { UserTypeOrmRepository } from './infrastructure/providers/user-typeorm.repository';

@Module({
  imports: [TypeOrmModule.forFeature([UserOrmEntity])], //Se registran las entidades de TypeORM (mapeo a la tabla 'profiles')
  providers: [
    // Se registran los casos de uso y repositorios aquí
    FindUserByEmailUseCase,

    // Se registra el Repositorio (Implementacion del Port)
    {
      provide: 'IUserRepository',
      useClass: UserTypeOrmRepository,
    },
  ],
  controllers: [],
  exports: [FindUserByEmailUseCase, 'IUserRepository'],
})
export class UsersModule {}
