import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/shared/guards/jwt-auth.guard';
import { RolesGuard } from 'src/shared/guards/roles.guard';
import { CreateTeacherUseCase } from '../../application/use-cases/create-teacher.use-case';
import { FindAllTeachersUseCase } from '../../application/use-cases/find-all-teachers.use-case';
import { AssignSubjectsToTeacherUseCase } from '../../application/use-cases/assign-subjects-to-teacher.use-case';
import { UserRole } from 'src/common/enums/user-role.enum';
import { CreateTeacherDto } from '../../application/dtos/create-teacher.dto';
import { Roles } from 'src/common/decorators/roles.decorator';
import { TeacherResponseDto } from '../../application/dtos/teacher-response.dto';
import { FindTeacherByIdUseCase } from '../../application/use-cases/find-teacher-by-id.use-case';
import { AssignSubjectsDto } from '../../application/dtos/assign-subjects.dto';
import { UpdateTeacherGeneralInfoUseCase } from '../../application/use-cases/update-teacher.use-case';
import { UpdateTeacherDto } from '../../application/dtos/update-teacher.dto';

@ApiTags('teachers')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('teachers')
export class TeachersController {
  constructor(
    private readonly createTeacherUseCase: CreateTeacherUseCase,
    private readonly findAllTeachersUseCase: FindAllTeachersUseCase,
    private readonly findTeacherByIdUseCase: FindTeacherByIdUseCase,
    private readonly asssignSubjectsUseCase: AssignSubjectsToTeacherUseCase,
    private readonly updateTeacherGeneralInfoUseCase: UpdateTeacherGeneralInfoUseCase,
  ) {}

  @Post()
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Create a new teacher' })
  async create(@Body() dto: CreateTeacherDto): Promise<TeacherResponseDto> {
    return this.createTeacherUseCase.execute(dto);
  }

  @Get()
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Get all teachers' })
  async findAll(): Promise<TeacherResponseDto[]> {
    return this.findAllTeachersUseCase.execute();
  }

  @Get(':userId')
  @Roles(UserRole.ADMIN, UserRole.TEACHER)
  @ApiOperation({ summary: 'Get a teacher by ID' })
  async findById(@Body() userId: string): Promise<TeacherResponseDto> {
    return this.findTeacherByIdUseCase.execute(userId);
  }

  // PUT /teachers/:id
  @Put(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Update a teacher by ID' })
  @ApiResponse({ status: 200, type: TeacherResponseDto })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateTeacherDto,
  ): Promise<TeacherResponseDto> {
    return this.updateTeacherGeneralInfoUseCase.execute(id, dto);
  }

  @Put(':userId/subjects')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Assign subjects to a teacher' })
  async assignSubjects(
    @Param('userId', ParseUUIDPipe) userId: string,
    @Body() subjectsIds: AssignSubjectsDto,
  ): Promise<TeacherResponseDto> {
    return this.asssignSubjectsUseCase.execute(userId, subjectsIds);
  }
}
