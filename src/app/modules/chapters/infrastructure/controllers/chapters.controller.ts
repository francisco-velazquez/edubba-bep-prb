import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  ParseIntPipe,
  Put,
  Delete,
  Query,
  UseGuards,
  HttpStatus,
  HttpCode,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { Roles } from 'src/common/decorators/roles.decorator';
import { UserRole } from 'src/common/enums/user-role.enum';
import { JwtAuthGuard } from 'src/shared/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { CreateChapterUseCase } from '../../application/use-cases/create-chapter.use-case';
import { FindChapterByIdUseCase } from '../../application/use-cases/find-chapter-by-id.use-case';
import { FindAllChaptersUseCase } from '../../application/use-cases/find-all-chapters.use-case';
import { FindChaptersByModuleUseCase } from '../../application/use-cases/find-chapters-by-module.use-case';
import { UpdateChapterUseCase } from '../../application/use-cases/update-chapter.use-case';
import { DeleteChapterUseCase } from '../../application/use-cases/delete-chapter.use-case';
import { CreateChapterDto } from '../../application/dtos/create-chapter.dto';
import { ChapterResponseDto } from '../../application/dtos/chapter-response.dto';
import { UpdateChapterDto } from '../../application/dtos/update-chapter.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadChapterMediaUseCase } from '../../application/use-cases/upload-chapter-media.use-case';
import { GetChapterUploadConfigUseCase } from '../../application/use-cases/get-chapter-upload-config.use-case';
import { ConfirmUploadDto } from '../../application/dtos/confirm-upload.dto';
import { ConfirmChapterUploadUseCase } from '../../application/use-cases/confirm-chapter-upload.use-case';

@ApiTags('chapters')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('chapters')
export class ChaptersController {
  constructor(
    private readonly createChapterUseCase: CreateChapterUseCase,
    private readonly findAllChaptersUseCase: FindAllChaptersUseCase,
    private readonly findChapterByIdUseCase: FindChapterByIdUseCase,
    private readonly findChaptersByModuleUseCase: FindChaptersByModuleUseCase,
    private readonly updateChapterUseCase: UpdateChapterUseCase,
    private readonly deleteChapterUseCase: DeleteChapterUseCase,
    private readonly uploadMediaUseCase: UploadChapterMediaUseCase,
    private readonly getChapterUploadConfigUseCase: GetChapterUploadConfigUseCase,
    private readonly confirmUploadUseCase: ConfirmChapterUploadUseCase,
  ) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.TEACHER)
  @ApiOperation({ 
    summary: 'Create a new chapter',
    description: 'Create a new chapter and associate it with a module.'
  })
  async create(
    @Body() createChapterDto: CreateChapterDto,
  ): Promise<ChapterResponseDto> {
    return this.createChapterUseCase.execute(createChapterDto);
  }

  @Get()
  @Roles(UserRole.ADMIN, UserRole.TEACHER, UserRole.STUDENT)
  @ApiOperation({ 
    summary: 'Get all chapters',
    description: 'Return a list of all existing chapters in the system'
  })
  async findAll(): Promise<ChapterResponseDto[]> {
    return this.findAllChaptersUseCase.execute();
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.TEACHER, UserRole.STUDENT)
  @ApiOperation({ 
    summary: 'Search of charpter by id',
    description: 'Search and return a chapter by its id. The id must be an integer.'
  })
  @ApiQuery({
    name: 'id'
  })
  async findById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ChapterResponseDto> {
    return this.findChapterByIdUseCase.execute(id);
  }

  @Get('by-module/:moduleId')
  @Roles(UserRole.ADMIN, UserRole.TEACHER, UserRole.STUDENT)
  @ApiOperation({
    summary:'Returns all capter',
    description:' Returns all chapters belong to a specific module. The moduleId must be of type integer.'
  })
  @ApiQuery({
    name: 'published',
    type: Boolean,
    required: false,
    description: 'Filter by published status',
  })
  @ApiOperation({ summary: 'Get all chapters by module' })
  async findByModule(
    @Param('moduleId', ParseIntPipe) moduleId: number,
    @Query('published') published: boolean,
  ): Promise<ChapterResponseDto[]> {
    return this.findChaptersByModuleUseCase.execute(moduleId, published);
  }

  @Put(':id')
  @Roles(UserRole.ADMIN, UserRole.TEACHER)
  @ApiOperation({ 
    summary: 'Update an exisiting charpter',
    description:'Modifies the information of an existing chapter. The id must be an integer.'
  })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateChapterDto,
  ): Promise<ChapterResponseDto> {
    return this.updateChapterUseCase.execute(id, dto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN, UserRole.TEACHER)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ 
    summary: 'Delete a chapter by its id',
    description:'Deletes a chapter by its id. The id must be an integer.'
  })
  async delete(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.deleteChapterUseCase.execute(id);
  }

  @Post(':id/upload-video')
  @Roles(UserRole.ADMIN, UserRole.TEACHER)
    @ApiOperation({ 
    summary: 'Uploads a video file for a chapter.',
    description:'Uploads a video file for a chapter. The file is sent as form-data with the key video. The id must be an integer.'
  })
  @UseInterceptors(FileInterceptor('video'))
  async uploadVideo(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.uploadMediaUseCase.execute(id, file, 'video');
  }

  @Post(':id/upload-content')
  @Roles(UserRole.ADMIN, UserRole.TEACHER)
  @UseInterceptors(FileInterceptor('file'))
  async uploadContent(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return await this.uploadMediaUseCase.execute(id, file, 'content');
  }

  // 1. Solicitar URL para subir
  @Post(':id/request-upload')
  @Roles(UserRole.ADMIN, UserRole.TEACHER)
  async requestUpload(
    @Param('id', ParseIntPipe) id: number,
    @Body()
    body: { fileName: string; contentType: string; type: 'video' | 'content' },
  ) {
    return await this.getChapterUploadConfigUseCase.execute(
      id,
      body.fileName,
      body.contentType,
      body.type,
    );
  }

  // 2. Confirmar que la subida terminó
  @Post(':id/confirm-upload')
  @Roles(UserRole.ADMIN, UserRole.TEACHER)
  async confirmUpload(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: ConfirmUploadDto,
  ) {
    return await this.confirmUploadUseCase.execute(id, dto.fileUrl, dto.type);
  }
}
