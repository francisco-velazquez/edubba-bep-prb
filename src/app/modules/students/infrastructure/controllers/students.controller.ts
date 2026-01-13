import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  ParseUUIDPipe,
  Put,
  HttpCode,
  HttpStatus,
  UseGuards,
  Delete,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/shared/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { UserRole } from 'src/common/enums/user-role.enum';
import { CreateStudentDto } from '../../application/dtos/create-student.dto';
import { CreateStudentUseCase } from '../../application/use-cases/create-student.use-case';
import { FindStudentByIdUseCase } from '../../application/use-cases/find-student-by-id.use-case';
import {
  UpdateStudentGradeDto,
  UpdateStudentUseCase,
} from '../../application/use-cases/update-student.use-case';
import { UpdateStudentGeneralInfoUseCase } from '../../application/use-cases/update-student-general-info.use-case';
import { FindAllStudentsUseCase } from '../../application/use-cases/find-all-students.use-case';
import { StudentResponseDto } from '../../application/dtos/student-response.dto';
import { UpdateStudentDto } from '../../application/dtos/update-student.dto';
import { DeleteStudentUseCase } from '../../application/use-cases/delete-student.use-case';

@ApiTags('students')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('students')
export class StudentsController {
  constructor(
    private readonly createStudentUseCase: CreateStudentUseCase,
    private readonly findAllStudentsUseCase: FindAllStudentsUseCase,
    private readonly findStudentByIdUseCase: FindStudentByIdUseCase,
    private readonly updateStudentGradeUseCase: UpdateStudentUseCase,
    private readonly updateStudentGeneralInfoUseCase: UpdateStudentGeneralInfoUseCase,
    private readonly deleteStudentUseCase: DeleteStudentUseCase,
  ) {}

  // POST /students
  @Post()
  @Roles(UserRole.ADMIN)
  @ApiOperation({
    summary: 'Crea el perfil académico de un estudiante (Requiere ADMIN)',
  })
  @ApiResponse({ status: 201, type: StudentResponseDto })
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: CreateStudentDto): Promise<StudentResponseDto> {
    return this.createStudentUseCase.execute(dto);
  }

  // GET /students
  @Get()
  @Roles(UserRole.ADMIN, UserRole.TEACHER)
  @ApiOperation({ summary: 'Obtiene el listado de todos los estudiantes' })
  @ApiResponse({ status: 200, type: [StudentResponseDto] })
  async findAll(): Promise<StudentResponseDto[]> {
    return this.findAllStudentsUseCase.execute();
  }

  // GET /students/:id
  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.TEACHER, UserRole.STUDENT)
  @ApiOperation({ summary: 'Obtiene un estudiante por ID' })
  @ApiResponse({ status: 200, type: StudentResponseDto })
  async findById(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<StudentResponseDto> {
    return this.findStudentByIdUseCase.execute(id);
  }

  // PUT /students/:id
  @Put(':id')
  @Roles(UserRole.ADMIN, UserRole.STUDENT)
  @ApiOperation({
    summary:
      'Actualiza la información general del estudiante (incluyendo datos del usuario)',
  })
  @ApiResponse({ status: 200, type: StudentResponseDto })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateStudentDto,
  ): Promise<StudentResponseDto> {
    return this.updateStudentGeneralInfoUseCase.execute(id, dto);
  }

  // PUT /students/:id/grade
  // Nuevo endpoint para la acción sugerida: actualizar el grado
  @Put(':id/grade')
  @Roles(UserRole.ADMIN, UserRole.TEACHER)
  @ApiOperation({ summary: 'Actualiza el grado académico de un estudiante' })
  @ApiResponse({ status: 200, type: StudentResponseDto })
  async updateGrade(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateStudentGradeDto,
  ): Promise<StudentResponseDto> {
    return this.updateStudentGradeUseCase.execute(id, dto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar (lógicamente) estudiante' })
  async delete(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    await this.deleteStudentUseCase.execute(id);
  }
}
