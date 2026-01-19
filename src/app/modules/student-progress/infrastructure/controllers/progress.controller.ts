import {
  Controller,
  Post,
  Get,
  Param,
  UseGuards,
  Req,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/shared/guards/jwt-auth.guard';
import { RolesGuard } from 'src/shared/guards/roles.guard';
import { Request } from 'express';
import { ActiveUser } from 'src/app/modules/auth/infrastructure/interfaces/active-user.interface';
import { CalculateProgress } from '../interaces/calculate-progress-result.interface';
import { ToggleChapterCompletionUseCase } from '../../application/use-cases/toggle-chapter-completion.use-case';
import { CalculateSubjectProgressUseCase } from '../../application/use-cases/calculate-subject-progress.use-case';

// Creamos un tipo que extienda el Request de Express
interface RequestWithUser extends Request {
  user: ActiveUser;
}

@ApiTags('progress')
@Controller('progress')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ProgressController {
  constructor(
    private readonly calculateProgress: CalculateSubjectProgressUseCase,
    private readonly toggleCompletion: ToggleChapterCompletionUseCase,
  ) {}

  @Post('chapter/:chapterId/complete')
  async completeChapter(
    @Req() req: RequestWithUser, // Tipado explícito para evitar 'any'
    @Param('chapterId', ParseIntPipe) chapterId: number,
  ): Promise<void> {
    // Retorno explícito
    const userId = req.user.id;
    // ESLint ya no marcará error porque sabe que 'this.toggleCompletion' existe y es seguro
    return await this.toggleCompletion.execute(userId, chapterId);
  }

  @Get('subject/:subjectId')
  async getSubjectProgress(
    @Req() req: RequestWithUser,
    @Param('subjectId', ParseIntPipe) subjectId: number,
  ): Promise<CalculateProgress> {
    const userId = req.user.id;
    return await this.calculateProgress.execute(userId, subjectId);
  }
}
