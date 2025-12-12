import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { I_SUBJECT_REPOSITORY } from '../../domain/subject.entity';
import type { ISubjectRepositoryPort } from '../ports/subject-repository.port';

@Injectable()
export class DeleteSubjectUseCase {
  constructor(
    @Inject(I_SUBJECT_REPOSITORY)
    private readonly subjectRepository: ISubjectRepositoryPort,
  ) {}

  async execute(id: number): Promise<void> {
    const exists = await this.subjectRepository.findById(id);

    if (!exists) {
      throw new NotFoundException('Subject not found');
    }

    await this.subjectRepository.delete(id);
  }
}
