import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { I_SUBJECT_REPOSITORY } from '../../domain/subject.entity';
import type { ISubjectRepositoryPort } from '../ports/subject-repository.port';
import { UpdateSubjectDto } from '../dtos/update-subject.dto';
import { SubjectResponseDto } from '../dtos/subject-response.dto';

@Injectable()
export class UpdateSubjectUseCase {
  constructor(
    @Inject(I_SUBJECT_REPOSITORY)
    private readonly subjectRepository: ISubjectRepositoryPort,
  ) {}

  async execute(
    id: number,
    dto: UpdateSubjectDto,
  ): Promise<SubjectResponseDto> {
    const existingSubject = await this.subjectRepository.findById(id);

    if (!existingSubject) {
      throw new NotFoundException('Subject not found');
    }

    const updatedSubject = await this.subjectRepository.save({
      ...existingSubject,
      ...dto,
      isActive: dto.isActive ?? existingSubject.isActive,
      updatedAt: new Date(),
    });

    const saved = await this.subjectRepository.save(updatedSubject);

    return new SubjectResponseDto(saved);
  }
}
