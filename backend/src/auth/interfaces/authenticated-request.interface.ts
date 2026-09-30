import type { JwtPayload } from './jwt-payload.interface.js';
import type { Request } from 'express';

/** Express request after AuthGuard has verified the token. */
export interface AuthenticatedRequest extends Request {
  user: JwtPayload;
}
