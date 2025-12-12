import { Teacher } from '../../domain/teacher.entity';
import { AssignSubjectsDto } from '../dtos/assign-subjects.dto';

export interface ITeacherRepositoryPort {
  save(teacher: Teacher): Promise<Teacher>;
  findAll(): Promise<Teacher[]>;
  findById(userId: string): Promise<Teacher | null>;
  assignSubjects(
    userId: string,
    subjectIds: AssignSubjectsDto,
  ): Promise<Teacher>;
}
