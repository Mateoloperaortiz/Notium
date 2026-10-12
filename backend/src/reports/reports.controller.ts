import type { PlatformReport } from './interfaces/platform-report.interface.js';
import { ReportsService } from './reports.service.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { Role } from '../users/enums/role.enum.js';
import { Controller, Get } from '@nestjs/common';

/** Platform report endpoint under /api/reports; restricted to administrators. */
@Roles(Role.Admin)
@Controller('reports')
export class ReportsController {
  public constructor(private readonly reportsService: ReportsService) {}

  /** GET /api/reports/platform: every user, semester, subject and grade of the platform. */
  @Get('platform')
  public getPlatformReport(): Promise<PlatformReport> {
    return this.reportsService.getPlatformReport();
  }
}
