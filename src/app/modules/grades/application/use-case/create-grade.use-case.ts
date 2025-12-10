import { Inject, Injectable } from "@nestjs/common";
import type { IGradeRepository } from "../ports/grade-repository.port";
import { I_GRADE_REPOSITORY } from "../ports/grade-repository.port";
import { CreateGradeDto } from "../dtos/create-grade.dto";
import { Grade } from "../../domain/grade.type";
import { GradeEntity } from "../../domain/grade.entity";

@Injectable()
export class CreateGradeUseCase {
  constructor(
    @Inject(I_GRADE_REPOSITORY)
    private readonly gradeRepository: IGradeRepository,
  ) {}

  async execute(dto: CreateGradeDto): Promise<Grade> {
    const newGrade = new GradeEntity({
      name: dto.name,
      level: dto.level,
      code: dto.code,
    });

    return this.gradeRepository.save(newGrade);
  }
}