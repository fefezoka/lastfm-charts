import { initTRPC } from '@trpc/server';
import { Context } from './context';
import superjson from 'superjson';
import { inferReactQueryProcedureOptions } from '@trpc/react-query';
import { AppRouter } from './routers/_app';

const t = initTRPC.context<Context>().create({ transformer: superjson });

export const router = t.router;
export const procedure = t.procedure;
export const middleware = t.middleware;
export type ReactQueryOptions = inferReactQueryProcedureOptions<AppRouter>;
