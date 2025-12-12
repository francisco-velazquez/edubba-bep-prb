import { Inject, Injectable } from '@nestjs/common';
import { I_MODULE_REPOSITORY } from '../../domain/module.entity';
import type { IModuleRepositoryPort } from '../ports/module-repository.port';
import { ModuleResponseDto } from '../dtos/module-response.dto';

@Injectable()
export class FindAllModulesUseCase {
  constructor(
    @Inject(I_MODULE_REPOSITORY)
    private readonly moduleRepository: IModuleRepositoryPort,
  ) {}

  async execute(): Promise<ModuleResponseDto[]> {
    const modules = await this.moduleRepository.findAll();

    return modules.map((module) => new ModuleResponseDto(module));
  }
}
