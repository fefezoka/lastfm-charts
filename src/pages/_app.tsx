import type { AppProps } from 'next/app';
import { DefaultSeo } from 'next-seo';
import { trpc } from '@utils';
import { global } from '@styles';
import { yunjin } from '@assets';

const MyApp = ({ Component, pageProps }: AppProps) => {
  global();

  return (
    <>
      <DefaultSeo
        title="Last Charts"
        openGraph={{
          images: [{ url: yunjin.src }],
          siteName: 'Last.fm Charts',
          description: 'Usa ai po',
          url: 'https://lastfmcharts.vercel.app',
          type: 'website',
        }}
        twitter={{ cardType: 'summary_large_image' }}
        additionalMetaTags={[{ name: 'theme-color', content: '#f42' }]}
      />
      <Component {...pageProps} />
    </>
  );
};

export default trpc.withTRPC(MyApp);
