import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { I_SUBJECT_REPOSITORY } from '../../domain/subject.entity';
import type { ISubjectRepositoryPort } from '../ports/subject-repository.port';
import { SubjectResponseDto } from '../dtos/subject-response.dto';

@Injectable()
export class FindSubjectByIdUseCase {
  constructor(
    @Inject(I_SUBJECT_REPOSITORY)
    private readonly subjectRepository: ISubjectRepositoryPort,
  ) {}

  async execute(id: number): Promise<SubjectResponseDto> {
    const subject = await this.subjectRepository.findById(id);

    if (!subject) {
      throw new NotFoundException('Subject not found');
    }

    return new SubjectResponseDto(subject);
  }
}
