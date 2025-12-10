import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import type { IGradeRepository } from "../ports/grade-repository.port";
import { I_GRADE_REPOSITORY } from "../ports/grade-repository.port";
import { FindGradeByIdUseCase } from "./find-grade-by-id.use-case";

@Injectable()
export class DeleteGradeUseCase {
  constructor(
    @Inject(I_GRADE_REPOSITORY)
    private readonly gradeRepository: IGradeRepository,
    // Reutilizamos el caso de uso para verificar existencias
    private readonly findGradedByIdUseCase: FindGradeByIdUseCase,
  ) {}

  async execute(id: number): Promise<void> {
    // Verificamos si existe el id antes de eliminarlo
    await this.findGradedByIdUseCase.execute(id);

    // Eliminamos el grado
    await this.gradeRepository.delete(id);
  }
}