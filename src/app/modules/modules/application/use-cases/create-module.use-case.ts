import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { I_MODULE_REPOSITORY } from '../../domain/module.entity';
import type { IModuleRepositoryPort } from '../ports/module-repository.port';
import { CreateModuleDto } from '../dtos/create-module.dto';
import { ModuleResponseDto } from '../dtos/module-response.dto';
import { I_SUBJECT_REPOSITORY } from 'src/app/modules/subjects/domain/subject.entity';
import type { ISubjectRepositoryPort } from 'src/app/modules/subjects/application/ports/subject-repository.port';

@Injectable()
export class CreateModuleUseCase {
  constructor(
    @Inject(I_MODULE_REPOSITORY)
    private readonly moduleRepository: IModuleRepositoryPort,
    @Inject(I_SUBJECT_REPOSITORY)
    private readonly subjectRepository: ISubjectRepositoryPort,
  ) {}

  async execute(dto: CreateModuleDto): Promise<ModuleResponseDto> {
    await this.validateSubject(dto.subjectId);

    const newModule = {
      title: dto.title,
      subjectId: dto.subjectId,
      orderIndex: dto.orderIndex ?? 0,
      isPublished: dto.isPublished ?? false,
    };

    const savedModule = await this.moduleRepository.save(newModule);

    return new ModuleResponseDto(savedModule);
  }

  private async validateSubject(subjectId: number) {
    // Debemos de validar que exista la asignatura a la que se quiere agregar el módulo
    const subject = await this.subjectRepository.findById(subjectId);

    // Validaciones de la asignatura
    if (!subject) throw new NotFoundException('Subject not found');
    if (!subject.isActive) throw new NotFoundException('Subject is not active');
  }
}
