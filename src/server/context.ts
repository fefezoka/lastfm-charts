import { inferAsyncReturnType } from '@trpc/server';

export const createContext = async (opts: any) => {
  return {};
};

export type Context = inferAsyncReturnType<typeof createContext>;
