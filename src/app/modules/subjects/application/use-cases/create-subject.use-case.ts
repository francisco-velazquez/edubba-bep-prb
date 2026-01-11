import { Inject, Injectable } from '@nestjs/common';
import { I_SUBJECT_REPOSITORY, Subject } from '../../domain/subject.entity';
import type { ISubjectRepositoryPort } from '../ports/subject-repository.port';
import { CreateSubjectDto } from '../dtos/create-subject.dto';
import { SubjectResponseDto } from '../dtos/subject-response.dto';

@Injectable()
export class CreateSubjectUseCase {
  constructor(
    @Inject(I_SUBJECT_REPOSITORY)
    private readonly subjectRepository: ISubjectRepositoryPort,
  ) {}

  async execute(dto: CreateSubjectDto): Promise<SubjectResponseDto> {
    const newSubject: Omit<Subject, 'id' | 'createdAt' | 'updatedAt'> = {
      name: dto.name,
      isActive: true,
      gradeId: dto.gradeId,
      description: dto.description,
      code: dto.code,
    };

    const savedSubject = await this.subjectRepository.save(newSubject);
    return new SubjectResponseDto(savedSubject);
  }
}
