export interface ProgressResultDto {
  percentage: number;
  completedChapters: number;
  totalChapters: number;
  completedChapterIds: number[];
  lastActivityAt?: Date;
  finishedAt?: Date | null;
}
