import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Body,
  Param,
  ParseIntPipe,
  UseGuards,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateQuestionDto } from '../../application/dtos/create-question.dto';
import { UpdateQuestionDto } from '../../application/dtos/update-question.dto';
import { QuestionResponseDto } from '../../application/dtos/question-response.dto';
import { JwtAuthGuard } from 'src/shared/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { UserRole } from 'src/common/enums/user-role.enum';
import { CreateQuestionUseCase } from '../../application/use-case/create-question.use-case';
import { UpdateQuestionUseCase } from '../../application/use-case/update-question.use-case';
import { DeleteQuestionUseCase } from '../../application/use-case/delete-question.use-case';
import { FindQuestionsByExamUseCase } from '../../application/use-case/find-questions-by-exam.use-case';

@ApiTags('questions')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('questions')
export class QuestionsController {
  constructor(
    private readonly createUseCase: CreateQuestionUseCase,
    private readonly updateUseCase: UpdateQuestionUseCase,
    private readonly deleteUseCase: DeleteQuestionUseCase,
    private readonly findByExamUseCase: FindQuestionsByExamUseCase,
  ) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.TEACHER)
  @ApiOperation({ summary: 'Crea una pregunta con sus opciones' })
  @ApiResponse({ status: HttpStatus.CREATED, type: QuestionResponseDto })
  async create(@Body() dto: CreateQuestionDto): Promise<QuestionResponseDto> {
    return await this.createUseCase.execute(dto);
  }

  @Get('by-exam/:examId')
  @Roles(UserRole.ADMIN, UserRole.TEACHER, UserRole.STUDENT)
  @ApiOperation({ summary: 'Obtiene todas las preguntas de un examen' })
  @ApiResponse({ status: HttpStatus.OK, type: [QuestionResponseDto] })
  async findByExam(
    @Param('examId', ParseIntPipe) examId: number,
  ): Promise<QuestionResponseDto[]> {
    return await this.findByExamUseCase.execute(examId);
  }

  @Put(':id')
  @Roles(UserRole.ADMIN, UserRole.TEACHER)
  @ApiOperation({ summary: 'Actualiza una pregunta y sus opciones' })
  @ApiResponse({ status: HttpStatus.OK, type: QuestionResponseDto })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateQuestionDto,
  ): Promise<QuestionResponseDto> {
    return await this.updateUseCase.execute(id, dto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN, UserRole.TEACHER)
  @ApiOperation({ summary: 'Elimina una pregunta y sus opciones (cascade)' })
  async delete(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.deleteUseCase.execute(id);
  }
}
