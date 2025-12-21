import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { I_EXAM_REPOSITORY } from '../../domain/exam.entity';
import type { IExamRepositoryPort } from '../ports/exam-repository.port';
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
    // Verificamos que el módulo existe
    const module = await this.moduleRepository.findById(dto.moduleId);

    if (!module) {
      throw new NotFoundException(`Module with id ${dto.moduleId} not found`);
    }

    // Verificamos si ya existe un examen para este módulo
    const existingExam = await this.examRepository.findByModuleId(dto.moduleId);

    if (existingExam) {
      throw new ConflictException(
        `An exam already exists fot module ID ${dto.moduleId}. Only one exam per module is allowed`,
      );
    }

    // Creamos el examen
    const newExam = { title: dto.title, moduleId: dto.moduleId };

    const savedExam = await this.examRepository.save(newExam);

    return new ExamResponseDto(savedExam);
  }
}
