import { createReactQueryHooks } from '@trpc/react';
import type { AppRouter } from '../server/router';

// Create hooks for tRPC
export const trpc = createReactQueryHooks<AppRouter>();
