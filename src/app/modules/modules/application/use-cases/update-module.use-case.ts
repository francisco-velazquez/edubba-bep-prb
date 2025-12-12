import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { I_MODULE_REPOSITORY } from '../../domain/module.entity';
import type { IModuleRepositoryPort } from '../ports/module-repository.port';
import { UpdateModuleDto } from '../dtos/update-module.dto';
import { ModuleResponseDto } from '../dtos/module-response.dto';
import { I_SUBJECT_REPOSITORY } from 'src/app/modules/subjects/domain/subject.entity';
import type { ISubjectRepositoryPort } from 'src/app/modules/subjects/application/ports/subject-repository.port';

@Injectable()
export class UpdateModuleUseCase {
  constructor(
    @Inject(I_MODULE_REPOSITORY)
    private readonly moduleRepository: IModuleRepositoryPort,
    @Inject(I_SUBJECT_REPOSITORY)
    private readonly subjectRepository: ISubjectRepositoryPort,
  ) {}

  async execute(id: number, dto: UpdateModuleDto): Promise<ModuleResponseDto> {
    if (dto.subjectId) await this.validateSubject(dto.subjectId);

    const existingModule = await this.moduleRepository.findById(id);

    if (!existingModule) {
      throw new NotFoundException('Module not found');
    }

    const updatedModule = await this.moduleRepository.save({
      ...existingModule,
      ...dto,
      updatedAt: new Date(),
    });

    const saved = await this.moduleRepository.save(updatedModule);

    return new ModuleResponseDto(saved);
  }

  //TODO: Separar estas validaciones
  private async validateSubject(subjectId: number) {
    // Debemos de validar que exista la asignatura a la que se quiere agregar el módulo
    const subject = await this.subjectRepository.findById(subjectId);

    // Validaciones de la asignatura
    if (!subject) throw new NotFoundException('Subject not found');
    if (!subject.isActive) throw new NotFoundException('Subject is not active');
  }
}
