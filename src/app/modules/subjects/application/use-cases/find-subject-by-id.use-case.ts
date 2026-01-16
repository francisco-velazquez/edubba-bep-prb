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

    //Debemos de firmar las urls de los recursos de los capitulos para que sean accesibles y visibles por el front
    // Recorremos los módulos que tiene la asignatura
    // subject?.modules?.forEach((module) => {
    //   // Recorremos los capitulos que tiene el módulo
    //   module?.chapters?.forEach((chapter) => {
    //   })
    // });

    if (!subject) {
      throw new NotFoundException('Subject not found');
    }

    return new SubjectResponseDto(subject);
  }
}
