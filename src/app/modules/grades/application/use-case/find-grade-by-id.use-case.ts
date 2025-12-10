import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { I_GRADE_REPOSITORY } from "../ports/grade-repository.port";
import type { IGradeRepository } from "../ports/grade-repository.port";
import { Grade } from "../../domain/grade.type";

@Injectable()
export class FindGradeByIdUseCase {
  constructor(
    @Inject(I_GRADE_REPOSITORY)
    private readonly gradeRepository: IGradeRepository,
  ) {}

  async execute(id: number): Promise<Grade> {
    const grade = await this.gradeRepository.findById(id);

    if(!grade) {
      throw new NotFoundException(`Grade with ID ${id} not found`);
    }

    return grade;
  }
}