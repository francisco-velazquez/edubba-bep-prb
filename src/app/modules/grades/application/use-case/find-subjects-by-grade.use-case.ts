import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { I_GRADE_REPOSITORY } from '../ports/grade-repository.port';
import type { IGradeRepository } from '../ports/grade-repository.port';
import { I_SUBJECT_REPOSITORY } from 'src/app/modules/subjects/domain/subject.entity';
import type { ISubjectRepositoryPort } from 'src/app/modules/subjects/application/ports/subject-repository.port';
import { SubjectResponseDto } from 'src/app/modules/subjects/application/dtos/subject-response.dto';

@Injectable()
export class FindSubjectsByGradeUseCase {
  constructor(
    @Inject(I_GRADE_REPOSITORY)
    private readonly gradeRepository: IGradeRepository,
    // Inyectamos el port de subjects
    @Inject(I_SUBJECT_REPOSITORY)
    private readonly subjectRepository: ISubjectRepositoryPort,
  ) {}

  async execute(gradeId: number): Promise<SubjectResponseDto[]> {
    // Verificar si el grado existe
    const grade = await this.gradeRepository.findById(gradeId);

    if (!grade) {
      throw new NotFoundException(`Grade with ID ${gradeId} not found`);
    }

    // Usamos el repositorio de subjects para encontrar las materias asociadas
    const subjects = await this.subjectRepository.findByGradeId(gradeId);

    // Devolvemos DTOs de respuesta de subjects
    return subjects.map((subject) => new SubjectResponseDto(subject));
  }
}
