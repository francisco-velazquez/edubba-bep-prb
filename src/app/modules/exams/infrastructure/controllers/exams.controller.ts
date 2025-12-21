import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { JwtAuthGuard } from 'src/shared/guards/jwt-auth.guard';
import { UserRole } from 'src/common/enums/user-role.enum';
import { Roles } from 'src/common/decorators/roles.decorator';
import { CreateExamUseCase } from '../../application/use-cases/create-exam.use-case';
import { FindExamByModuleUseCase } from '../../application/use-cases/find-exam-by-module.use-case';
import { FindExamByIdUseCase } from '../../application/use-cases/find-exam-by-id.use-case';
import { UpdateExamUseCase } from '../../application/use-cases/update-exam.use-case';
import { DeleteExamUseCase } from '../../application/use-cases/delete-exam.use-case';
import { CreateExamDto } from '../../application/dtos/create-exam.dto';
import { ExamResponseDto } from '../../application/dtos/exam-response.dto';
import { UpdateExamDto } from '../../application/dtos/update-exam.dto';

@ApiTags('exams')
@Controller('exams')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ExamsController {
  constructor(
    private readonly createUseCase: CreateExamUseCase,
    private readonly findByModuleUseCase: FindExamByModuleUseCase,
    private readonly findByIdUseCase: FindExamByIdUseCase, // Asumiendo que existe
    private readonly updateUseCase: UpdateExamUseCase, // Asumiendo que existe
    private readonly deleteUseCase: DeleteExamUseCase, // Asumiendo que existe
  ) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.TEACHER)
  @ApiOperation({ summary: 'Crea un nuevo examen (máximo uno por capítulo)' })
  async create(@Body() dto: CreateExamDto): Promise<ExamResponseDto> {
    return this.createUseCase.execute(dto);
  }

  @Put(':id')
  @Roles(UserRole.ADMIN, UserRole.TEACHER)
  @ApiOperation({ summary: 'Actualiza un examen existente' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateExamDto,
  ): Promise<ExamResponseDto> {
    return this.updateUseCase.execute(id, dto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN, UserRole.TEACHER)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Elimina un examen' })
  async delete(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.deleteUseCase.execute(id);
  }

  // --- BUSQUEDA ---
  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.TEACHER, UserRole.STUDENT)
  @ApiOperation({ summary: 'Obtiene un examen por ID' })
  async findById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ExamResponseDto> {
    return this.findByIdUseCase.execute(id);
  }

  @Get('by-module/:moduleId')
  @Roles(UserRole.ADMIN, UserRole.TEACHER, UserRole.STUDENT)
  @ApiOperation({ summary: 'Obtiene el examen asociado a un módulo' })
  async findByModule(
    @Param('moduleId', ParseIntPipe) moduleId: number,
  ): Promise<ExamResponseDto> {
    return this.findByModuleUseCase.execute(moduleId);
  }
}
