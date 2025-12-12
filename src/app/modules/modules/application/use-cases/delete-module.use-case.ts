import { Inject, Injectable } from '@nestjs/common';
import { I_MODULE_REPOSITORY } from '../../domain/module.entity';
import type { IModuleRepositoryPort } from '../ports/module-repository.port';

@Injectable()
export class DeleteModuleUseCase {
  constructor(
    @Inject(I_MODULE_REPOSITORY)
    private readonly moduleRepository: IModuleRepositoryPort,
  ) {}

  async execute(id: number): Promise<boolean> {
    const exists = await this.moduleRepository.findById(id);

    if (!exists) {
      return false;
    }

    await this.moduleRepository.delete(id);

    return true;
  }
}
