import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import databaseConfig from '../shared/config/app.config';

// Application Modules
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { GradeModule } from './modules/grades/grade.module';
import { StudentsModule } from './modules/students/students.module';

@Module({
  imports: [
    // Módulo de configuración: Carga el .env y el app.config.ts
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig],
    }),

    // Modulo de TypeOrn: Conexión a la base de datos
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        console.log('Database configuration loading...');
        
        return {
          type: 'postgres',
          host: configService.get('DATABASE_HOST'),
          port: configService.get('DATABASE_PORT'),
          username: configService.get('DATABASE_USERNAME'),
          password: configService.get('DATABASE_PASSWORD'),
          database: configService.get('DATABASE_NAME'),
          autoLoadEntities: true,
          synchronize: false,
          ssl: configService.get('NODE_ENV') === 'production' 
            ? { rejectUnauthorized: false } 
            : false,
          // Opciones adicionales para debugging
          logging: true,
          extra: {
            connectionTimeoutMillis: 5000,
          },
        };
      },
    }),

    // Módulo de Autenticación
    AuthModule,

    // Módulo de Usuarios
    UsersModule,

    // Módulo de grados academicos
    GradeModule,

    // Módulo de estudiasnte
    StudentsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
