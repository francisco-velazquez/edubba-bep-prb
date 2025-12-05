import { registerAs } from '@nestjs/config';

export default registerAs('database', () => ({
  type: 'postgres',
  host: process.env.DATABASE_HOST,
  port: parseInt(process.env.DATABASE_PORT!, 10) || 5432,
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  autoLoadEntities: true,
  synchronize: false,
  ssl: {
    rejectUnauthorized: process.env.NODE_ENV === 'production',
  },
}));
