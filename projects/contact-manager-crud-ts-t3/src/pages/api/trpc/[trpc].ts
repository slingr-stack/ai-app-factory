import { createNextApiHandler } from '@trpc/server/adapters/next';
import { appRouter } from '../../../server/router';

// Export API handler
export default createNextApiHandler({
  router: appRouter,
  createContext: () => ({}),
});
