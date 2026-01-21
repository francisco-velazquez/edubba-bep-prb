import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { I_EXAM_REPOSITORY } from '../../domain/entities/exam.entity';
import type { IExamRepositoryPort } from '../../domain/ports/exam-repository.port';
import { I_MODULE_REPOSITORY } from 'src/app/modules/modules/domain/module.entity';
import type { IModuleRepositoryPort } from 'src/app/modules/modules/application/ports/module-repository.port';
import { CreateExamDto } from '../dtos/create-exam.dto';
import { ExamResponseDto } from '../dtos/exam-response.dto';

@Injectable()
export class CreateExamUseCase {
  constructor(
    @Inject(I_EXAM_REPOSITORY)
    private readonly examRepository: IExamRepositoryPort,
    @Inject(I_MODULE_REPOSITORY)
    private readonly moduleRepository: IModuleRepositoryPort,
  ) {}

  async execute(dto: CreateExamDto): Promise<ExamResponseDto> {
    // 1. Verificamos que el módulo existe
    const module = await this.moduleRepository.findById(dto.moduleId);

    if (!module) {
      throw new NotFoundException(`Module with id ${dto.moduleId} not found`);
    }

    // 2. Verificamos si ya existe un examen para este módulo
    const existing = await this.examRepository.findByModuleId(dto.moduleId);
    if (existing) {
      throw new BadRequestException('El módulo ya tiene un examen asignado.');
    }

    // 3. Creamos el examen y envolvemos el resultado en el DTO
    const newExam = await this.examRepository.createFullExam(dto);

    // Importante: Instanciamos el DTO para cumplir con el tipo de retorno Promise<ExamResponseDto>
    return new ExamResponseDto(newExam);
  }
}
