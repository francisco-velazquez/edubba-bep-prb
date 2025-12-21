import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { I_EXAM_REPOSITORY } from '../../domain/exam.entity';
import type { IExamRepositoryPort } from '../ports/exam-repository.port';
import { I_MODULE_REPOSITORY } from 'src/app/modules/modules/domain/module.entity';
import type { IModuleRepositoryPort } from 'src/app/modules/modules/application/ports/module-repository.port';
import { ExamResponseDto } from '../dtos/exam-response.dto';
import { UpdateExamDto } from '../dtos/update-exam.dto';

@Injectable()
export class UpdateExamUseCase {
  constructor(
    @Inject(I_EXAM_REPOSITORY)
    private readonly examRepository: IExamRepositoryPort,
    @Inject(I_MODULE_REPOSITORY)
    private readonly moduleRepository: IModuleRepositoryPort,
  ) {}

  async execute(id: number, dto: UpdateExamDto): Promise<ExamResponseDto> {
    // Verificamos que el módulo existe
    const module = await this.moduleRepository.findById(dto.moduleId!);

    if (!module) {
      throw new NotFoundException(`Module with id ${dto.moduleId} not found`);
    }

    // Verificamos si ya existe un examen
    const existingExam = await this.examRepository.findById(id);

    if (!existingExam) {
      throw new NotFoundException(`Exam with id ${id} not found`);
    }
    // Actualizamos el examen
    const updatedExam = {
      ...existingExam,
      ...dto,
      updatedAt: new Date(),
    };

    const savedExam = await this.examRepository.save(updatedExam);

    return new ExamResponseDto(savedExam);
  }
}
