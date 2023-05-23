import React, { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import htmltocanvas from 'html2canvas';
import { FormData } from './index';
import { useRouter } from 'next/router';
import { BsArrowLeft } from 'react-icons/bs';
import { HiOutlineDownload } from 'react-icons/hi';
import { trpc } from '@utils';
import { GetServerSideProps } from 'next';
import { Box, Flex, Heading, ProfileIcon, Text } from '@styles';
import { spinner } from '@assets';

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { username, period, type } = ctx.query as FormData;

  if (!username) {
    return {
      redirect: {
        destination: '/',
      },
      props: {},
    };
  }

  return {
    props: {
      username,
      period: period || '7day',
      type: type || 'albums',
    },
  };
};

export default function Profile({ username, period, type }: FormData) {
  const [previousChart, setPreviousChart] = useState<Record<string, number>>();
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const user = trpc.user.useQuery({ username });
  const chart = trpc.chart.useQuery(
    { username, period, type },
    {
      staleTime: 1000 * 60 * 2.5,
      onSuccess: (data) => {
        window.localStorage.setItem(
          `${username}_${type}_${period}`,
          JSON.stringify(
            data.chart.reduce(
              (accumulator, current: any) =>
                Object.assign(accumulator, { [current.url]: Number(current.playcount) }),
              {}
            )
          )
        );
      },
    }
  );

  useEffect(() => {
    const data = window.localStorage.getItem(`${username}_${type}_${period}`);
    data && setPreviousChart(JSON.parse(data));
  }, [period, username, type]);

  const downloadChart = useCallback(() => {
    if (ref.current === null) {
      return;
    }

    htmltocanvas(ref.current, {
      scale: 2.33,
      windowHeight: 1080,
      allowTaint: false,
      useCORS: true,
      windowWidth: 1920,
    }).then((canvas) => {
      const link = document.createElement('a');
      link.download = `${username}_${type}_${period}`;
      link.href = canvas.toDataURL();
      link.click();
    });
  }, [ref, period, type, username]);

  if (chart.isLoading || user.isLoading) {
    return (
      <Flex justify={'center'} align={'center'} css={{ height: '100vh', bc: '$bg1' }}>
        <Image src={spinner} height={144} width={144} alt="" />
      </Flex>
    );
  }

  if (chart.isError || user.isError) {
    setTimeout(() => {
      router.push('/');
    }, 3000);

    return (
      <Flex
        justify={'center'}
        align={'center'}
        css={{ height: '100vh', bc: '$bg1', px: '$6' }}
      >
        <Box css={{ ta: 'center' }}>
          <Heading gradient color={'red'} size="4">
            User &quot;{username}&quot; not found :(
          </Heading>
          <Heading css={{ mt: '$3' }}>Being redirected in 3 seconds...</Heading>
        </Box>
      </Flex>
    );
  }

  return (
    <Flex
      justify={'center'}
      align={'center'}
      direction={'column'}
      css={{ height: '100vh', bc: '$bg1' }}
    >
      <Box
        ref={ref}
        css={{
          bc: '$bg1',
          maxWidth: '100%',
          px: '$3',
          p: '$3',
          position: 'relative',
        }}
      >
        <Box
          data-html2canvas-ignore
          as={'button'}
          css={{ position: 'absolute', top: 12, '@bp2': { top: 32 }, left: 8 }}
        >
          <BsArrowLeft size={36} onClick={() => router.push('/')} />
        </Box>
        <Box
          data-html2canvas-ignore
          as={'button'}
          css={{ position: 'absolute', top: 12, '@bp2': { top: 32 }, right: 8 }}
        >
          <HiOutlineDownload size={36} onClick={downloadChart} />
        </Box>
        <Heading
          size={'5'}
          color={'red'}
          weight={'500'}
          css={{ ta: 'center', display: 'block' }}
        >
          Last.fm Charts
        </Heading>
        <Link target="_blank" href={'https://last.fm/user/' + user.data.name}>
          <Flex
            justify={'center'}
            align={'center'}
            gap={'6'}
            css={{ mt: '$3', mb: '$2' }}
          >
            <ProfileIcon src={user.data.image[3]['#text']} alt="" css={{ size: 60 }} />
            <Heading>{user.data.name}</Heading>
            <Flex direction={'column'} align={'center'}>
              <Text weight={600}>{user.data.playcount}</Text>
              <Text>scrobbles</Text>
            </Flex>
          </Flex>
        </Link>
        <Heading css={{ ta: 'center' }}>
          {type.charAt(0).toUpperCase() + type.slice(1, type.length)} -{' '}
          {period !== 'overall'
            ? `Last ${period.charAt(0)} ${period.slice(1, period.length)}${
                period !== '1month' ? 's' : ''
              }`
            : period.charAt(0).toUpperCase() + period.slice(1, period.length)}
        </Heading>
        <Box
          as={'table'}
          css={{
            display: 'block',
            borderCollapse: 'collapse',
            mt: '$2',
            overflow: 'auto',
            '&::-webkit-scrollbar': { display: 'none' },
          }}
        >
          <Box as={'thead'} css={{ ta: 'left' }}>
            <Box as={'tr'}>
              <Box as={'th'} />
              <Box as={'th'}>{type === 'albums' ? 'ALBUM' : 'SONG'}</Box>
              <Box as={'th'}>ARTIST</Box>
            </Box>
          </Box>
          <Box as={'tbody'}>
            {chart.data.chart.map((item: any, index: number) => (
              <Box
                as={'tr'}
                key={item.name}
                css={{
                  bc: index % 2 === 0 ? '$bg2' : '$bg3',
                  '& td': { px: '$2', height: 34, borderLeft: '1px solid $bg1' },
                }}
              >
                <Box as={'td'}>
                  <Flex justify={'between'} align={'center'} gap={'2'}>
                    {previousChart?.[item.url] ? (
                      previousChart[item.url] == item.playcount ? (
                        <Text size={'2'}>(=)</Text>
                      ) : previousChart[item.url] < item.playcount ? (
                        <Text size={'2'} color={'green'}>
                          (+{item.playcount - previousChart[item.url]})
                        </Text>
                      ) : (
                        <Text size={'2'} color={'red'}>
                          (-{previousChart[item.url] - item.playcount})
                        </Text>
                      )
                    ) : (
                      <Text size={'2'} color={'gold'}>
                        (NEW)
                      </Text>
                    )}
                    <Link
                      href={`${user.data.url}/library/${
                        item.url.split('https://www.last.fm/')[1]
                      }`}
                      target="_blank"
                    >
                      <Text size={'4'} color={'red'}>
                        {item.playcount}
                      </Text>
                    </Link>
                  </Flex>
                </Box>
                <Box
                  as={'td'}
                  css={{
                    minWidth: 280,
                    maxWidth: 280,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  <Link href={item.url} target="_blank">
                    <Flex align={'center'} gap={'2'}>
                      {type === 'albums' && (
                        <Box css={{ size: 34, position: 'relative', fs: 0 }}>
                          <Image src={item.image[0]['#text']} alt="" fill priority />
                        </Box>
                      )}

                      <Text size={'5'} weight={600}>
                        {item.name}
                      </Text>
                    </Flex>
                  </Link>
                </Box>
                <Box
                  as={'td'}
                  css={{
                    minWidth: 170,
                    maxWidth: 170,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  <Link href={item.artist.url} target="_blank">
                    <Text size={'5'}>{item.artist.name}</Text>
                  </Link>
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>
    </Flex>
  );
}
