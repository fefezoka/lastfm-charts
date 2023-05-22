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
        type: z.enum(['albums', 'tracks']),
        period: z.enum(['7day', '1month', '3month', '6month', '12month', 'overall']),
      })
    )
    .query(async ({ input }) => {
      const data = await lastfm.get(
        `?method=user.gettop${input.type}&user=${input.username}&limit=10
        &period=${input.period}&api_key=${process.env.LASTFM_KEY}&format=json`
      );
      const chart: [] =
        data.data['top' + input.type][input.type.slice(0, input.type.length - 1)];

      const scrobbles = chart.reduce((acc, curr: any) => acc + Number(curr.playcount), 0);
      return {
        chart,
        scrobbles,
      };
    }),
});

export type AppRouter = typeof appRouter;
