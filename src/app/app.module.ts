import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import databaseConfig from '../shared/config/app.config';

// Application Modules
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';

export interface DatabaseConfig {
  type: 'postgres';
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
  ssl: {
    rejectUnauthorized: boolean;
  };
}

export default () => ({
  database: {
    type: 'postgres',
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    ssl: {
      rejectUnauthorized: process.env.DB_SSL_REJECT === 'true',
    },
  } as DatabaseConfig,
});

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
        // Obtenemos la configuración de la base de datos
        const dbConfig = configService.get<DatabaseConfig>('database');

        if (!dbConfig) {
          throw new Error('Database configuration not found.');
        }

        return {
          type: dbConfig.type,
          host: dbConfig.host,
          port: dbConfig.port,
          username: dbConfig.username,
          password: dbConfig.password,
          database: dbConfig.database,
          // Aquí TypeORM buscará las entidades dentro de la estructura de módulos
          autoLoadEntities: true,
          synchronize: false,
          // Opciones de SSL necesarias para la conexión remota con Supabase
          ssl: {
            rejectUnauthorized: dbConfig.ssl.rejectUnauthorized,
          },
        };
      },
    }),

    // Módulo de Autenticación
    AuthModule,

    // Módulo de Usuarios
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
