import { Inject, Injectable } from '@nestjs/common';
import { I_SUBJECT_REPOSITORY } from '../../domain/subject.entity';
import type { ISubjectRepositoryPort } from '../ports/subject-repository.port';
import { SubjectResponseDto } from '../dtos/subject-response.dto';

@Injectable()
export class FindAllSubjectsUseCase {
  constructor(
    @Inject(I_SUBJECT_REPOSITORY)
    private readonly subjectRepository: ISubjectRepositoryPort,
  ) {}

  async execute(): Promise<SubjectResponseDto[]> {
    const subjects = await this.subjectRepository.findAll();

    return subjects.map((subject) => new SubjectResponseDto(subject));
  }
}
