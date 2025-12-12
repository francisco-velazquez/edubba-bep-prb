import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { I_MODULE_REPOSITORY } from '../../domain/module.entity';
import type { IModuleRepositoryPort } from '../ports/module-repository.port';
import { ModuleResponseDto } from '../dtos/module-response.dto';

@Injectable()
export class FindModuleByIdUseCase {
  constructor(
    @Inject(I_MODULE_REPOSITORY)
    private readonly moduleRepository: IModuleRepositoryPort,
  ) {}

  async execute(id: number): Promise<ModuleResponseDto> {
    const module = await this.moduleRepository.findById(id);

    if (!module) {
      throw new NotFoundException('Module not found');
    }

    return new ModuleResponseDto(module);
  }
}
