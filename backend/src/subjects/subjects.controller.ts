import { CreateSubjectDto } from './dto/create-subject.dto.js';
import { UpdateSubjectDto } from './dto/update-subject.dto.js';
import { Subject } from './entities/subject.entity.js';
import { SubjectsService } from './subjects.service.js';
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

/** Subject endpoints under /api/subjects; each one acts on the user of the token. */
@Controller('subjects')
export class SubjectsController {
  public constructor(private readonly subjectsService: SubjectsService) {}

  /** GET /api/subjects: the user's subjects; optional ?semesterId filters by semester. */
  @Get()
  public findAll(
    @CurrentUser() user: JwtPayload,
    @Query('semesterId') semesterId?: string,
  ): Promise<Subject[]> {
    return this.subjectsService.findAll(
      user.sub,
      semesterId === undefined ? undefined : Number(semesterId),
    );
  }

  /** GET /api/subjects/:id: one subject; 404 if it does not exist or is another user's. */
  @Get(':id')
  public findOne(@CurrentUser() user: JwtPayload, @Param('id') id: string): Promise<Subject> {
    return this.subjectsService.findOne(Number(id), user.sub);
  }

  /** POST /api/subjects: creates a subject in a semester the user owns. */
  @Post()
  public create(
    @CurrentUser() user: JwtPayload,
    @Body() createSubjectDto: CreateSubjectDto,
  ): Promise<Subject> {
    return this.subjectsService.create(createSubjectDto, user.sub);
  }

  /** PATCH /api/subjects/:id: updates a subject of the user. */
  @Patch(':id')
  public update(
    @CurrentUser() user: JwtPayload,
    @Param('id') id: string,
    @Body() updateSubjectDto: UpdateSubjectDto,
  ): Promise<Subject> {
    return this.subjectsService.update(Number(id), updateSubjectDto, user.sub);
  }

  /** DELETE /api/subjects/:id: removes a subject of the user and returns 204. */
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  public remove(@CurrentUser() user: JwtPayload, @Param('id') id: string): Promise<void> {
    return this.subjectsService.remove(Number(id), user.sub);
  }
}
