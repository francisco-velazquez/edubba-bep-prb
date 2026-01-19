export class StudentProgress {
  id?: number;
  userId: string;
  chapterId: number;
  completedAt: Date;
}

export const I_PROGRESS_REPOSITORY = 'I_PROGRESS_REPOSITORY';
