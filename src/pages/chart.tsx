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
  const { data: user } = trpc.user.useQuery({ username });
  const { data: chart } = trpc.chart.useQuery(
    { username, period, type },
    {
      staleTime: 60 * 2.5,
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
      windowWidth: 1920,
    }).then((canvas) => {
      const link = document.createElement('a');
      link.download = `${username}_${type}_${period}`;
      link.href = canvas.toDataURL();
      link.click();
    });
  }, [ref, period, type, username]);

  if (!chart) {
    return <></>;
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
          css={{ position: 'absolute', '@bp2': { top: 32 }, left: 16 }}
        >
          <BsArrowLeft size={36} onClick={() => router.push('/')} />
        </Box>
        <Box
          data-html2canvas-ignore
          as={'button'}
          css={{ position: 'absolute', '@bp2': { top: 32 }, right: 16 }}
        >
          <HiOutlineDownload size={36} onClick={downloadChart} />
        </Box>
        <Heading size="5" color={'red'} css={{ ta: 'center' }}>
          Last.fm Charts
        </Heading>
        <Link target="_blank" href={'https://last.fm/user/' + user.name}>
          <Flex justify={'center'} align={'center'} gap={'6'} css={{ my: '$2' }}>
            <ProfileIcon src={user.image[3]['#text']} alt="" css={{ size: 60 }} />
            <Heading>{user.name}</Heading>
            <Flex direction={'column'} align={'center'}>
              <Text weight={600}>{user.playcount}</Text>
              <Text>scrobbles</Text>
            </Flex>
          </Flex>
        </Link>
        <Heading css={{ ta: 'center' }}>
          {type.charAt(0).toUpperCase() + type.slice(1, type.length)} -{' '}
          {period !== 'overall'
            ? `${period.charAt(0)} ${period.slice(1, period.length)}${
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
            {chart.chart.map((item: any, index: number) => (
              <Box
                as={'tr'}
                key={item.name}
                css={{
                  bc: index % 2 === 0 ? '$bg2' : '$bg3',
                  '& td': { px: '$2', height: 42, borderLeft: '1px solid $bg1' },
                }}
              >
                <Box as={'td'}>
                  <Flex justify={'between'} align={'center'} gap={'2'}>
                    {previousChart?.[item.url] ? (
                      previousChart[item.url] < item.playcount ? (
                        <Text size={'2'} color={'green'}>
                          (+{item.playcount - previousChart[item.url]})
                        </Text>
                      ) : (
                        <Text size={'2'}>(=)</Text>
                      )
                    ) : (
                      <Text size={'2'} color={'gold'}>
                        (NEW)
                      </Text>
                    )}
                    <Link
                      href={`${user.url}/library/music/${
                        item.url.split('https://www.last.fm/music/')[1]
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
                        <Image
                          src={item.image[2]['#text']}
                          alt=""
                          width={42}
                          height={42}
                        />
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
