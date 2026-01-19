export interface IProgressRepositoryPort {
  markAsCompleted(userId: string, chapterId: number): Promise<void>;
  findCompletedChaptersByUserAndSubject(
    userId: string,
    subjectId: number,
  ): Promise<number[]>;
  countTotalChaptersInSubject(subjectId: number): Promise<number>;
  isChapterCompleted(userId: string, chapterId: number): Promise<boolean>;
}
