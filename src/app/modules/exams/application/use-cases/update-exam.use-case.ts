import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { I_EXAM_REPOSITORY } from '../../domain/entities/exam.entity';
import type { IExamRepositoryPort } from '../../domain/ports/exam-repository.port';
import { I_MODULE_REPOSITORY } from 'src/app/modules/modules/domain/module.entity';
import type { IModuleRepositoryPort } from 'src/app/modules/modules/application/ports/module-repository.port';
import { ExamResponseDto } from '../dtos/exam-response.dto';
import { CreateExamDto } from '../dtos/create-exam.dto';

@Injectable()
export class UpdateExamUseCase {
  constructor(
    @Inject(I_EXAM_REPOSITORY)
    private readonly examRepository: IExamRepositoryPort,
    @Inject(I_MODULE_REPOSITORY)
    private readonly moduleRepository: IModuleRepositoryPort,
  ) {}

  async execute(
    id: number,
    dto: Partial<CreateExamDto>,
  ): Promise<ExamResponseDto> {
    // 1. Verificamos que el examen a actualizar existe
    const existingExam = await this.examRepository.findById(id);
    if (!existingExam) {
      throw new NotFoundException(`Exam with id ${id} not found`);
    }

    // 2. Si se intenta cambiar el módulo, verificamos que el nuevo módulo existe
    if (dto.moduleId) {
      const module = await this.moduleRepository.findById(dto.moduleId);
      if (!module) {
        throw new NotFoundException(`Module with id ${dto.moduleId} not found`);
      }
    }

    // 3. Actualizamos el examen en el repositorio
    const updatedExam = await this.examRepository.updateFullExam(id, dto);

    // 4. Retornamos el DTO instanciado
    return new ExamResponseDto(updatedExam);
  }
}
