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
  Req,
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
import { SubmitExamUseCase } from '../../application/use-cases/submit-exam.use-case';
import { GetLastAttemptUseCase } from '../../application/use-cases/get-last-attempt.use-case';
import { CreateExamDto } from '../../application/dtos/create-exam.dto';
import { ExamResponseDto } from '../../application/dtos/exam-response.dto';
import { UpdateExamDto } from '../../application/dtos/update-exam.dto';
import { SubmitExamDto } from '../../application/dtos/submit-exam.dto';
import { ActiveUser } from 'src/app/modules/auth/infrastructure/interfaces/active-user.interface';
import { FindExamsBySubjectUseCase } from '../../application/use-cases/find-exams-by-subject.use-case';

// Creamos un tipo que extienda el Request de Express
interface RequestWithUser extends Request {
  user: ActiveUser;
}

@ApiTags('exams')
@Controller('exams')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ExamsController {
  constructor(
    private readonly createUseCase: CreateExamUseCase,
    private readonly findByModuleUseCase: FindExamByModuleUseCase,
    private readonly findByIdUseCase: FindExamByIdUseCase,
    private readonly updateUseCase: UpdateExamUseCase,
    private readonly deleteUseCase: DeleteExamUseCase,
    private readonly submitExamUseCase: SubmitExamUseCase,
    private readonly getLastAttemptUseCase: GetLastAttemptUseCase,
    private readonly findExamsBySubjectUseCase: FindExamsBySubjectUseCase,
  ) {}

  // --- ACCIONES DE MAESTRO/ADMIN ---

  @Post()
  @Roles(UserRole.ADMIN, UserRole.TEACHER)
  @ApiOperation({ summary: 'Crea un nuevo examen (máximo uno por módulo)' })
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

  // --- BÚSQUEDA (Híbrida: Maestro ve todo, Alumno ve ofuscado) ---

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.TEACHER, UserRole.STUDENT)
  @ApiOperation({ summary: 'Obtiene un examen por ID' })
  async findById(
    @Req() req: RequestWithUser,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ExamResponseDto> {
    // Pasamos el rol extraído del JWT para la lógica de ofuscación
    return this.findByIdUseCase.execute(id, req.user.role);
  }

  @Get('by-module/:moduleId')
  @Roles(UserRole.ADMIN, UserRole.TEACHER, UserRole.STUDENT)
  @ApiOperation({ summary: 'Obtiene el examen asociado a un módulo' })
  async findByModule(
    @Req() req: RequestWithUser,
    @Param('moduleId', ParseIntPipe) moduleId: number,
  ): Promise<ExamResponseDto> {
    return this.findByModuleUseCase.execute(moduleId, req.user.role);
  }

  // --- ACCIONES DE ALUMNO ---

  @Post(':id/submit')
  @Roles(UserRole.STUDENT)
  @ApiOperation({ summary: 'Envía las respuestas de un examen para calificar' })
  async submit(
    @Req() req: RequestWithUser,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: SubmitExamDto,
  ) {
    return this.submitExamUseCase.execute(req.user.id, id, dto);
  }

  @Get(':id/last-attempt')
  @Roles(UserRole.STUDENT)
  @ApiOperation({
    summary: 'Obtiene el último resultado del alumno en este examen',
  })
  async getLastAttempt(
    @Req() req: RequestWithUser,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.getLastAttemptUseCase.execute(req.user.id, id);
  }

  @Get('by-subject/:subjectId')
  @Roles(UserRole.ADMIN, UserRole.TEACHER, UserRole.STUDENT)
  @ApiOperation({
    summary: 'Obtiene todos los exámenes de una asignatura específica',
  })
  async findBySubject(
    @Req() req: RequestWithUser,
    @Param('subjectId', ParseIntPipe) subjectId: number,
  ): Promise<ExamResponseDto[]> {
    return await this.findExamsBySubjectUseCase.execute(
      subjectId,
      req.user.role,
    );
  }
}
