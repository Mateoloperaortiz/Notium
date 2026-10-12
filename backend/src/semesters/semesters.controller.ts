import { CreateSemesterDto } from './dto/create-semester.dto.js';
import { UpdateSemesterDto } from './dto/update-semester.dto.js';
import { Semester } from './entities/semester.entity.js';
import { SemestersService } from './semesters.service.js';
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
} from '@nestjs/common';

/** Semester endpoints under /api/semesters; each one acts on the user of the token. */
@Controller('semesters')
export class SemestersController {
  public constructor(private readonly semestersService: SemestersService) {}

  /** GET /api/semesters: the semesters of the session user. */
  @Get()
  public findAll(@CurrentUser() user: JwtPayload): Promise<Semester[]> {
    return this.semestersService.findAll(user.sub);
  }

  /** GET /api/semesters/:id: one semester; 404 if it does not exist or is another user's. */
  @Get(':id')
  public findOne(@CurrentUser() user: JwtPayload, @Param('id') id: string): Promise<Semester> {
    return this.semestersService.findOne(Number(id), user.sub);
  }

  /** POST /api/semesters: creates a semester for the session user. */
  @Post()
  public create(
    @CurrentUser() user: JwtPayload,
    @Body() createSemesterDto: CreateSemesterDto,
  ): Promise<Semester> {
    return this.semestersService.create(createSemesterDto, user.sub);
  }

  /** PATCH /api/semesters/:id: updates a semester of the session user. */
  @Patch(':id')
  public update(
    @CurrentUser() user: JwtPayload,
    @Param('id') id: string,
    @Body() updateSemesterDto: UpdateSemesterDto,
  ): Promise<Semester> {
    return this.semestersService.update(Number(id), updateSemesterDto, user.sub);
  }

  /** DELETE /api/semesters/:id: removes a semester of the session user and returns 204. */
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  public remove(@CurrentUser() user: JwtPayload, @Param('id') id: string): Promise<void> {
    return this.semestersService.remove(Number(id), user.sub);
  }
}
