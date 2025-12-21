import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChapterOrmEntity } from './infrastructure/entities/chapter-orm.entity';
import { AuthModule } from '../auth/auth.module';
import { ModulesModule } from '../modules/modules.module';
import { ChaptersController } from './infrastructure/controllers/chapters.controller';
import { CreateChapterUseCase } from './application/use-cases/create-chapter.use-case';
import { FindAllChaptersUseCase } from './application/use-cases/find-all-chapters.use-case';
import { FindChapterByIdUseCase } from './application/use-cases/find-chapter-by-id.use-case';
import { FindChaptersByModuleUseCase } from './application/use-cases/find-chapters-by-module.use-case';
import { UpdateChapterUseCase } from './application/use-cases/update-chapter.use-case';
import { DeleteChapterUseCase } from './application/use-cases/delete-chapter.use-case';
import { I_CHAPTER_REPOSITORY } from './domain/chapter.entity';
import { ChapterTypeOrmRepository } from './infrastructure/providers/chapter-typeorm.repository';
import { UploadChapterMediaUseCase } from './application/use-cases/upload-chapter-media.use-case';
import { GetChapterUploadConfigUseCase } from './application/use-cases/get-chapter-upload-config.use-case';
import { ConfirmChapterUploadUseCase } from './application/use-cases/confirm-chapter-upload.use-case';

@Module({
  imports: [
    TypeOrmModule.forFeature([ChapterOrmEntity]),
    AuthModule,
    ModulesModule,
  ],
  controllers: [ChaptersController],
  providers: [
    CreateChapterUseCase,
    FindAllChaptersUseCase,
    FindChapterByIdUseCase,
    FindChaptersByModuleUseCase,
    UpdateChapterUseCase,
    DeleteChapterUseCase,
    UploadChapterMediaUseCase,
    GetChapterUploadConfigUseCase,
    ConfirmChapterUploadUseCase,
    {
      provide: I_CHAPTER_REPOSITORY,
      useClass: ChapterTypeOrmRepository,
    },
  ],
  exports: [I_CHAPTER_REPOSITORY],
})
export class ChaptersModule {}
