import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { JwtAuthGuard } from 'src/shared/guards/jwt-auth.guard';
import { CreateModuleUseCase } from '../../application/use-cases/create-module.use-case';
import { UpdateModuleUseCase } from '../../application/use-cases/update-module.use-case';
import { FindAllModulesUseCase } from '../../application/use-cases/find-all-modules.use-case';
import { FindModuleByIdUseCase } from '../../application/use-cases/find-module-by-id.use-case';
import { DeleteModuleUseCase } from '../../application/use-cases/delete-module.use-case';
import { UserRole } from 'src/common/enums/user-role.enum';
import { Roles } from 'src/common/decorators/roles.decorator';
import { CreateModuleDto } from '../../application/dtos/create-module.dto';
import { ModuleResponseDto } from '../../application/dtos/module-response.dto';
import { UpdateModuleDto } from '../../application/dtos/update-module.dto';
import { ChaptersByModuleResponseDto } from '../../application/dtos/chapters-by-module-id.dto';
import { FindChaptersByModuleIdUseCase } from '../../application/use-cases/find-chapters-by-module-id.use-case';

@ApiTags('modules')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('modules')
export class ModulesController {
  constructor(
    private readonly createModuleUseCase: CreateModuleUseCase,
    private readonly findAllModulesUseCase: FindAllModulesUseCase,
    private readonly findModuleByIdUseCase: FindModuleByIdUseCase,
    private readonly updateModuleUseCase: UpdateModuleUseCase,
    private readonly deleteModuleUseCase: DeleteModuleUseCase,
    private readonly findChaptersByModuleIdUseCase: FindChaptersByModuleIdUseCase,
  ) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.TEACHER)
  @ApiOperation({ summary: 'Create a new module' })
  async create(@Body() dto: CreateModuleDto): Promise<ModuleResponseDto> {
    return this.createModuleUseCase.execute(dto);
  }

  @Get()
  @Roles(UserRole.ADMIN, UserRole.TEACHER, UserRole.STUDENT)
  @ApiOperation({ summary: 'List all active modules' })
  async findAll(): Promise<ModuleResponseDto[]> {
    return this.findAllModulesUseCase.execute();
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.TEACHER, UserRole.STUDENT)
  @ApiOperation({ summary: 'Get module by ID' })
  async findById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ModuleResponseDto> {
    return this.findModuleByIdUseCase.execute(id);
  }

  @Put(':id')
  @Roles(UserRole.ADMIN, UserRole.TEACHER)
  @ApiOperation({ summary: 'Update a module' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateModuleDto,
  ): Promise<ModuleResponseDto> {
    return this.updateModuleUseCase.execute(id, dto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN, UserRole.TEACHER)
  @ApiOperation({ summary: 'Delete a module' })
  async delete(@Param('id', ParseIntPipe) id: number): Promise<void> {
    console.log('delete');
    await this.deleteModuleUseCase.execute(id);
  }

  @Get(':id/chapters')
  @Roles(UserRole.ADMIN, UserRole.TEACHER, UserRole.STUDENT)
  @ApiOperation({ summary: 'List all chapters of a module' })
  async findChaptersByModuleId(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ChaptersByModuleResponseDto> {
    return this.findChaptersByModuleIdUseCase.execute(id);
  }
}
