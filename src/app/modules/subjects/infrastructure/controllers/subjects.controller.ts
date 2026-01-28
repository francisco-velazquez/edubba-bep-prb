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
import { CreateSubjectUseCase } from '../../application/use-cases/create-subject.use-case';
import { FindAllSubjectsUseCase } from '../../application/use-cases/find-all-subjects.use-case';
import { FindSubjectByIdUseCase } from '../../application/use-cases/find-subject-by-id.use-case';
import { UpdateSubjectUseCase } from '../../application/use-cases/update-subject.use-case';
import { DeleteSubjectUseCase } from '../../application/use-cases/delete-subject.use-case';
import { Roles } from 'src/common/decorators/roles.decorator';
import { CreateSubjectDto } from '../../application/dtos/create-subject.dto';
import { SubjectResponseDto } from '../../application/dtos/subject-response.dto';
import { UserRole } from 'src/common/enums/user-role.enum';
import { UpdateSubjectDto } from '../../application/dtos/update-subject.dto';
import { ActiveUser } from 'src/app/modules/auth/infrastructure/interfaces/active-user.interface';
import { FindSubjectByTeacherUseCase } from '../../application/use-cases/find-subject-by-teacher.use-case';

// Creamos un tipo que extienda el Request de Express
interface RequestWithUser extends Request {
  user: ActiveUser;
}

@ApiTags('subjects')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('subjects')
export class SubjectsController {
  constructor(
    private readonly createUseCase: CreateSubjectUseCase,
    private readonly findAllUseCase: FindAllSubjectsUseCase,
    private readonly findByIdUseCase: FindSubjectByIdUseCase,
    private readonly updateUseCase: UpdateSubjectUseCase,
    private readonly deleteUseCase: DeleteSubjectUseCase,
    private readonly findSubjectByTeacherUseCase: FindSubjectByTeacherUseCase,
  ) {}

  @Post()
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Crear nueva asignatura' })
  async create(@Body() dto: CreateSubjectDto): Promise<SubjectResponseDto> {
    return this.createUseCase.execute(dto);
  }

  @Get()
  @Roles(UserRole.ADMIN, UserRole.TEACHER, UserRole.STUDENT)
  @ApiOperation({ summary: 'Listar todas las asignaturas activas' })
  async findAll(): Promise<SubjectResponseDto[]> {
    return this.findAllUseCase.execute();
  }

  @Get('by-teacher')
  @Roles(UserRole.TEACHER)
  @ApiOperation({ summary: 'Listar asignaturas del profesor autenticado' })
  async findAllByTeacher(
    @Req() req: RequestWithUser,
  ): Promise<SubjectResponseDto[]> {
    return this.findSubjectByTeacherUseCase.execute(req.user.id);
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.TEACHER, UserRole.STUDENT)
  @ApiOperation({ summary: 'Obtener asignatura por ID' })
  async findById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<SubjectResponseDto> {
    return this.findByIdUseCase.execute(id);
  }

  @Put(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Actualizar asignatura' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateSubjectDto,
  ): Promise<SubjectResponseDto> {
    return this.updateUseCase.execute(id, dto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar (lógicamente) asignatura' })
  async delete(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.deleteUseCase.execute(id);
  }
}
