import { Module } from '@nestjs/common';
import { UsersModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthController } from './infrastructure/controllers/auth.controller';
import { LoginUserUseCase } from './application/use-cases/login-user.use-case';
import { JwtTokenService } from './infrastructure/providers/jwt-token.service';
import { JwtStrategy } from './infrastructure/strategies/jwt.strategy';
import { RegisterUserUseCase } from './application/use-cases/register-user.use-case';
import { SupabaseModule } from 'src/shared/supabase/supabase.module';
import { RolesGuard } from 'src/shared/guards/roles.guard';

@Module({
  imports: [
    // Dependencias del módulo de Users
    UsersModule,
    SupabaseModule,

    // Configuración del módulo JWT
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        // Debemos de obtener la clave secreta de las variables de entorno
        // En supabase, sería la clave que usa el servicio de Auth para firmar tokens
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '60m' } // Tiempo de expiración del token
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [
    // Casos de uso
    LoginUserUseCase,
    RegisterUserUseCase,
    // Imp,ementación del port
    {
      provide: 'ITokenServicePort', // Llave de la inyección
      useClass: JwtTokenService
    },

    JwtStrategy,
    RolesGuard,
  ],

  exports: [
    // Exportamos el módulo jwt y la extrategía para que los guards puedan hacer uso de ellos globalmente
    JwtModule,
    JwtStrategy,
    RolesGuard,
  ]
})
export class AuthModule {}
