import { CreateGradeDto } from './dto/create-grade.dto.js';
import { UpdateGradeDto } from './dto/update-grade.dto.js';
import { Grade } from './entities/grade.entity.js';
import { GradesService } from './grades.service.js';
import { CurrentUser } from '../auth/decorators/current-user.decorator.js';
import type { JwtPayload } from '../auth/interfaces/jwt-payload.interface.js';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';

/** Grade endpoints under /api/grades; each one acts on the user of the token. */
@Controller('grades')
export class GradesController {
  public constructor(private readonly gradesService: GradesService) {}

  /** GET /api/grades: the user's grades; optional ?subjectId filters by subject. */
  @Get()
  public findAllByUserId(
    @CurrentUser() user: JwtPayload,
    @Query('subjectId') subjectId?: string,
  ): Promise<Grade[]> {
    return this.gradesService.findAllByUserId(
      user.sub,
      subjectId === undefined ? undefined : Number(subjectId),
    );
  }

  /** GET /api/grades/:id: one grade; 404 if it does not exist or is another user's. */
  @Get(':id')
  public findOneByUserId(@CurrentUser() user: JwtPayload, @Param('id') id: string): Promise<Grade> {
    return this.gradesService.findOneByUserId(Number(id), user.sub);
  }

  /** POST /api/grades: creates a grade in a subject the user owns. */
  @Post()
  public create(
    @CurrentUser() user: JwtPayload,
    @Body() createGradeDto: CreateGradeDto,
  ): Promise<Grade> {
    return this.gradesService.create(createGradeDto, user.sub);
  }

  /** PATCH /api/grades/:id: updates a grade of the user. */
  @Patch(':id')
  public update(
    @CurrentUser() user: JwtPayload,
    @Param('id') id: string,
    @Body() updateGradeDto: UpdateGradeDto,
  ): Promise<Grade> {
    return this.gradesService.update(Number(id), updateGradeDto, user.sub);
  }

  /** DELETE /api/grades/:id: removes a grade of the user and returns 204. */
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  public remove(@CurrentUser() user: JwtPayload, @Param('id') id: string): Promise<void> {
    return this.gradesService.remove(Number(id), user.sub);
  }
}
