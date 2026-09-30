import { type CustomDecorator, SetMetadata } from '@nestjs/common';

/** Metadata key that AuthGuard reads to skip the token check. */
export const IS_PUBLIC_KEY = 'isPublic';

/** Marks a route that can be used without a session. */
export const Public = (): CustomDecorator<string> => SetMetadata(IS_PUBLIC_KEY, true);
