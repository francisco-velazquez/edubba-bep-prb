import { Grade, GradeLevel } from "../../domain/grade.type";

export class GradeResponseDto {
  id: number;
  name: string;
  level: GradeLevel;
  code: string;
  isActive: boolean;

  constructor(grade: Grade) {
    this.id = grade.id;
    this.name = grade.name;
    this.level = grade.level;
    this.code = grade.code;
    this.isActive = grade.isActive;
  }
}