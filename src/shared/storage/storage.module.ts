import { Module, Global } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { I_STORAGE_PORT } from './application/ports/storage.port';
import { S3StorageProvider } from './infrastructure/providers/s3-storage.provider';

@Global() // Lo hacemos global para no tener que importarlo en cada módulo
@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: I_STORAGE_PORT,
      useClass: S3StorageProvider,
    },
  ],
  exports: [I_STORAGE_PORT], // Exportamos el Token, no la clase
})
export class StorageModule {}
