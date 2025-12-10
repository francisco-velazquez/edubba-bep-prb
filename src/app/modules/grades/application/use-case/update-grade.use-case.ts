import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import type { IGradeRepository } from "../ports/grade-repository.port";
import { I_GRADE_REPOSITORY } from "../ports/grade-repository.port";
import { FindGradeByIdUseCase } from "./find-grade-by-id.use-case";
import { UpdateGradeDto } from "../dtos/update-grade.dto";
import { Grade } from "../../domain/grade.type";


@Injectable()
export class UpdateGradeUseCase {
  constructor(
    @Inject(I_GRADE_REPOSITORY)
    private readonly gradeRepository: IGradeRepository,
    // Reutilizamos el caso de uso para verificar existencias
    private readonly findGradedByIdUseCase: FindGradeByIdUseCase,
  ) {}

  async execute(id: number, dto: UpdateGradeDto): Promise<Grade> {
    // Verificamos que exista el grado a actualizar
    const existingGrade = await this.findGradedByIdUseCase.execute(id);

    // Aplicamos solo los cambios
    const updatedGrade: Partial<Grade> = {
      ...existingGrade,
      ...dto,
      id: id,
      updatedAt: new Date()
    };

    // Guardamos la modificación
    return this.gradeRepository.save(updatedGrade);
  }
}