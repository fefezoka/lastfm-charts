import { z } from 'zod';
import { router, procedure } from '../trpc';
import axios from 'axios';

const lastfm = axios.create({
  baseURL: `http://ws.audioscrobbler.com/2.0/`,
});

export const appRouter = router({
  user: procedure.input(z.object({ username: z.string() })).query(async ({ input }) => {
    const data = await lastfm.get(
      `?method=user.getinfo&user=${input.username}&api_key=${process.env.LASTFM_KEY}&format=json`
    );
    return data.data.user;
  }),
  chart: procedure
    .input(
      z.object({
        username: z.string(),
        type: z.enum(['albums', 'tracks', 'artists']).optional().default('albums'),
        period: z
          .enum(['7day', '1month', '3month', '6month', '1year', 'overall'])
          .optional()
          .default('7day'),
        format: z
          .enum(['3x3', '4x4', '5x4', '5x5', '6x6', '8x6', '8x8', '10x10'])
          .optional()
          .default('4x4'),
      })
    )
    .query(async ({ input }) => {
      const data = await lastfm.get(
        `?method=user.gettop${input.type}&user=${input.username}&limit=${eval(
          input.format.replace('x', '*')
        )}&period=${input.period}&api_key=${process.env.LASTFM_KEY}&format=json`
      );
      return {
        chart: data.data['top' + input.type][input.type.slice(0, input.type.length - 1)],
      };
    }),
});

export type AppRouter = typeof appRouter;
