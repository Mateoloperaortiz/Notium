import type { PlatformReportDTO } from '@/dtos/PlatformReportDTOs.js';
import { BaseService } from '@/services/BaseService.js';

/** Reads the platform-wide report for administrators through the API. */
export class PlatformReportService extends BaseService {
  /** Returns every user, semester, subject and grade of the platform. */
  public static async getPlatformReport(): Promise<PlatformReportDTO> {
    const { data } =
      await PlatformReportService.getClient().get<PlatformReportDTO>('/reports/platform');

    return data;
  }
}
