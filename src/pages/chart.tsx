import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import html2canvas from 'html2canvas';
import { FormData } from './index';
import { useRouter } from 'next/router';
import { BsArrowLeft } from 'react-icons/bs';
import { trpc } from '@utils';
import { Box, Flex, Grid, Heading, ProfileIcon, Text } from '@styles';

type RouterQuery = Omit<FormData, 'format'> & {
  format: Pick<FormData, 'format'>['format']['value'];
};

export default function Profile() {
  const [img, setImg] = useState<string>();
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { username, format, period, type } = router.query as RouterQuery;
  const { data: user } = trpc.user.useQuery({ username }, { enabled: !!username });
  const { data: chart } = trpc.chart.useQuery(
    { username, format, period, type },
    { enabled: !!username }
  );

  useEffect(() => {
    if (ref.current === null) {
      return;
    }

    html2canvas(ref.current, {
      scale: 1.75,
    }).then((canvas) => {
      setImg(canvas.toDataURL('image/png', 1));
    });
  }, [ref, chart]);

  if (!chart) {
    return <></>;
  }

  return (
    <Box as={'main'} css={{ height: '100vh' }}>
      <Box css={{ width: '100%', bc: '$bg2', mb: '$4' }}>
        <Flex
          justify={'between'}
          align={'center'}
          css={{ py: '$2', px: '$6', maxWidth: 768, m: 'auto' }}
        >
          <Box>
            <Text weight={600}>
              {type || 'albums'}, {format || '5x5'}, {period || '7day'}
            </Text>
          </Box>
          <Flex justify={'center'} align={'center'} gap={'6'}>
            <ProfileIcon src={user.image[3]['#text']} alt="" css={{ size: 56 }} />
            <Heading>{user.name}</Heading>
            <Flex direction={'column'} align={'center'}>
              <Text weight={600}>{user.playcount}</Text>
              <Text>scrobbles</Text>
            </Flex>
          </Flex>
          <Flex as={'button'} onClick={() => router.push('/')}>
            <BsArrowLeft size={36} />
          </Flex>
        </Flex>
      </Box>

      <Box css={{ m: 'auto', width: 'fit-content' }}>
        {img ? (
          <Image
            src={img}
            alt=""
            width={170 * Number(format.charAt(0))}
            height={170 * Number(format.charAt(2))}
          />
        ) : (
          <Grid
            ref={ref}
            css={{
              gridTemplateColumns: `repeat(${format.substring(
                0,
                format.indexOf('x')
              )}, 1fr)`,
              position: 'relative',
            }}
          >
            <Flex
              id={'loading'}
              justify={'center'}
              align={'center'}
              data-html2canvas-ignore
              css={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                zIndex: 999,
                backdropFilter: 'blur(3px)',
              }}
            />
            {chart.chart.map((item: any, index: any) => (
              <Flex key={index} css={{ position: 'relative' }}>
                <Image
                  src={item.image[3]['#text']}
                  alt=""
                  height={170}
                  width={170}
                  quality={100}
                  priority
                />
                <Flex
                  direction={'column'}
                  align={'center'}
                  justify={'end'}
                  css={{
                    pb: '$1',
                    position: 'absolute',
                    bottom: 0,
                    width: '100%',
                    height: '40%',
                    ta: 'center',
                    background: 'linear-gradient(transparent, $blackA10)',
                  }}
                >
                  {type !== 'artists' && (
                    <Text size={'0'} weight={600}>
                      {item.artist.name}
                    </Text>
                  )}
                  <Text size={'0'} weight={600}>
                    {item.name}
                  </Text>
                </Flex>
              </Flex>
            ))}
          </Grid>
        )}
      </Box>
    </Box>
  );
}
