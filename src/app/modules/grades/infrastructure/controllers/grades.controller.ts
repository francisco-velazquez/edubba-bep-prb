import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Post, Put, UseGuards } from "@nestjs/common";
import { CreateGradeUseCase } from "../../application/use-case/create-grade.use-case";
import { FindAllGradesUseCase } from "../../application/use-case/find-all-grades.use-case";
import { CreateGradeDto } from "../../application/dtos/create-grade.dto";
import { Grade } from "../../domain/grade.type";
import { FindGradeByIdUseCase } from "../../application/use-case/find-grade-by-id.use-case";
import { UpdateGradeUseCase } from "../../application/use-case/update-grade.use-case";
import { DeleteGradeUseCase } from "../../application/use-case/delete-grade.use-case";
import { UpdateGradeDto } from "../../application/dtos/update-grade.dto";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "src/shared/guards/jwt-auth.guard";
import { RolesGuard } from "src/shared/guards/roles.guard";
import { Roles } from 'src/common/decorators/roles.decorator'; 
import { UserRole } from 'src/common/enums/user-role.enum'; 

@ApiTags('grades')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('grades')
export class GradesController {
  constructor(
    private readonly createGradeUseCase: CreateGradeUseCase,
    private readonly findAllGradesUseCase: FindAllGradesUseCase,
    private readonly findGradeByIdUseCase: FindGradeByIdUseCase,
    private readonly updateGradeUseCase: UpdateGradeUseCase,
    private readonly deleteGradeUseCase: DeleteGradeUseCase,
  ) {}

  @Post()
  @ApiOperation({
    summary: 'Creación de grado académico',
    description: 'Crea un nuevo campo académico en la base de datos'
  })
  @ApiResponse({
    status: 200,
    description: 'Grado academico creado'
  })
  @Roles(UserRole.ADMIN)
  async create(@Body() dto: CreateGradeDto): Promise<Grade> {
    return this.createGradeUseCase.execute(dto);
  }

  @Get()
  @ApiOperation({
    summary: 'Obtener todos los grados',
    description: 'Obtiene todos los grados academicos registrados en la base de datos'
  })
  @Roles(UserRole.ADMIN, UserRole.TEACHER, UserRole.STUDENT)
  async findAll(): Promise<Grade[]> {
    return this.findAllGradesUseCase.execute();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Obtención de grado por ID',
    description: 'Obtiene un grado académico dado su identificador'
  })
  @Roles(UserRole.ADMIN, UserRole.TEACHER)
  async findById(@Param('id', ParseIntPipe) id: number): Promise<Grade> {
    return this.findGradeByIdUseCase.execute(id);
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Actualización de grado académico',
    description: 'Actualiza un grado academico dado su identificador'
  })
  @Roles(UserRole.ADMIN)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateGradeDto,
  ): Promise<Grade> {
    return this.updateGradeUseCase.execute(id, dto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Eliminación de grado académico',
    description: 'Elimina un grado académico en base a su identificador, de forma lógica'
  })
  @Roles(UserRole.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.deleteGradeUseCase.execute(id);
  }
}