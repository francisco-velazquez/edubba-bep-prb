import { Controller, Post, Body, Get, Param, ParseUUIDPipe, Put, Delete, HttpCode, HttpStatus, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/shared/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard'; 
import { Roles } from 'src/common/decorators/roles.decorator'; 
import { UserRole } from 'src/common/enums/user-role.enum'; 
import { Student } from '../../domain/student.type';
import { CreateStudentDto } from '../../application/dtos/create-student.dto';
import { UpdateStudentDto } from '../../application/dtos/update-student.dto';
import { CreateStudentUseCase } from '../../application/use-cases/create-student.use-case';
import { FindStudentByIdUseCase } from '../../application/use-cases/find-student-by-id.use-case';
import { UpdateStudentUseCase } from '../../application/use-cases/update-student.use-case';
import { DeleteStudentUseCase } from '../../application/use-cases/delete-student.use-case';
import { FindAllStudentsUseCase } from '../../application/use-cases/find-all-students.use-case';
import { RegisterStudentUseCase } from '../../application/use-cases/register-student.use-case';
import { RegisterStudentDto } from '../../application/dtos/register-student.dto';

@ApiTags('students')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('students')
export class StudentsController {
  constructor(
    private readonly registerStudentUseCase: RegisterStudentUseCase,
    private readonly createStudentUseCase: CreateStudentUseCase,
    private readonly findAllStudentsUseCase: FindAllStudentsUseCase,
    private readonly findStudentByIdUseCase: FindStudentByIdUseCase,
    private readonly updateStudentUseCase: UpdateStudentUseCase,
    private readonly softDeleteStudentUseCase: DeleteStudentUseCase,
  ) {}

  @Post('register') 
  @Roles(UserRole.ADMIN) // Solo el ADMIN puede registrar nuevos estudiantes
  @ApiOperation({ summary: 'Registra una cuenta de usuario y crea el perfil de estudiante' })
  @ApiResponse({ status: 201, description: 'Estudiante creado exitosamente.' })
  async register(@Body() dto: RegisterStudentDto): Promise<Student> {
    console.log(`Body ${JSON.stringify(dto, null, 2)}}`)
    return this.registerStudentUseCase.execute(dto);
  }

  // POST /students
  @Post()
  @Roles(UserRole.ADMIN) 
  @ApiOperation({ summary: 'Registra un nuevo estudiante (Requiere ADMIN)' })
  async create(@Body() dto: CreateStudentDto): Promise<Student> {
    return this.createStudentUseCase.execute(dto);
  }

  // GET /students
  @Get()
  @Roles(UserRole.ADMIN, UserRole.TEACHER) 
  @ApiOperation({ summary: 'Obtiene el listado de todos los estudiantes activos' })
  async findAll(): Promise<Student[]> {
    return this.findAllStudentsUseCase.execute();
  }

  // GET /students/:id
  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.TEACHER, UserRole.STUDENT) 
  @ApiOperation({ summary: 'Obtiene un estudiante por ID' })
  // ParseUUIDPipe valida que el ID sea un formato UUID válido
  async findById(@Param('id', ParseUUIDPipe) id: string): Promise<Student> {
    // 🔑 NOTA: Aquí se añadiría lógica para que un STUDENT solo pueda ver SU propio ID
    return this.findStudentByIdUseCase.execute(id);
  }

  // PUT /students/:id
  @Put(':id')
  @Roles(UserRole.ADMIN) 
  @ApiOperation({ summary: 'Actualiza los datos de un estudiante' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateStudentDto,
  ): Promise<Student> {
    return this.updateStudentUseCase.execute(id, dto);
  }

  // DELETE /students/:id (Eliminación lógica)
  @Delete(':id')
  @Roles(UserRole.ADMIN) 
  @ApiOperation({ summary: 'Da de baja a un estudiante (Eliminación lógica)' })
  @HttpCode(HttpStatus.NO_CONTENT) 
  async softDelete(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    await this.softDeleteStudentUseCase.execute(id);
  }
}