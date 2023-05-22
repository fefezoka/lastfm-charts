import React, { useEffect } from 'react';
import Link from 'next/link';
import { z } from 'zod';
import { FaGithub } from 'react-icons/fa';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Box, Button, Flex, Grid, Heading, Input, Text } from '@styles';

const formSchema = z.object({
  username: z.string().nonempty(),
  type: z.enum(['albums', 'tracks']),
  period: z.enum(['7day', '1month', '3month', '6month', '12month', 'overall']),
});

export type FormData = z.infer<typeof formSchema>;

export default function Home() {
  const router = useRouter();
  const { register, setValue, handleSubmit, watch } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  useEffect(() => {
    const data = window.localStorage.getItem('config');
    if (!data) {
      return;
    }
    const previous = JSON.parse(data) as FormData;
    setValue('period', previous.period);
    setValue('type', previous.type);
    setValue('username', previous.username);
  }, [setValue]);

  const handleGenerateChart = (data: FormData) => {
    window.localStorage.setItem('config', JSON.stringify(data));

    router.push({
      pathname: '/chart',
      query: {
        username: data.username,
        type: data.type,
        period: data.period,
      },
    });
  };

  return (
    <Flex
      align={'center'}
      direction={'column'}
      justify={'center'}
      css={{ height: '100vh', px: '$4' }}
      onSubmit={handleSubmit(handleGenerateChart)}
    >
      <Heading gradient size="4" color={'red'}>
        Last.fm Charts
      </Heading>
      <Box css={{ ta: 'center' }}>
        <Heading size="3">
          Generate custom charts based on your{' '}
          <Link href={'https://last.fm'}>
            <Heading size="3" as={'span'} gradient color={'red'}>
              Last.fm
            </Heading>
          </Link>{' '}
          scrobbles
        </Heading>
      </Box>
      <Box
        as={'form'}
        css={{
          mt: 32,
          '@bp2': {
            width: 333,
          },
        }}
      >
        <Box>
          <Heading>Type your last.fm username</Heading>
          <Input {...register('username')} css={{ width: '100%', mt: '$1' }} />
        </Box>
        <Box css={{ mt: '$3' }}>
          <Heading>Chart type</Heading>
          <Grid columns={'2'} gap={'3'} css={{ mt: '$1' }} justify={'between'}>
            <Button
              active={watch('type') === 'albums'}
              onClick={() => setValue('type', 'albums')}
              defaultChecked
            >
              Albums
            </Button>
            <Button
              active={watch('type') === 'tracks'}
              onClick={() => setValue('type', 'tracks')}
            >
              Tracks
            </Button>
          </Grid>
        </Box>
        <Box css={{ mt: '$3' }}>
          <Heading>Chart period</Heading>
          <Grid columns={'3'} css={{ mt: '$1' }} gap={'3'} justify={'between'}>
            <Button
              active={watch('period') === '7day'}
              onClick={() => setValue('period', '7day')}
            >
              1 week
            </Button>
            <Button
              active={watch('period') === '1month'}
              onClick={() => setValue('period', '1month')}
            >
              1 month
            </Button>
            <Button
              active={watch('period') === '3month'}
              onClick={() => setValue('period', '3month')}
            >
              3 months
            </Button>
            <Button
              active={watch('period') === '6month'}
              onClick={() => setValue('period', '6month')}
            >
              6 months
            </Button>
            <Button
              active={watch('period') === '12month'}
              onClick={() => setValue('period', '12month')}
            >
              1 year
            </Button>
            <Button
              active={watch('period') === 'overall'}
              onClick={() => setValue('period', 'overall')}
            >
              Overall
            </Button>
          </Grid>
        </Box>
        <Button type="submit" css={{ mt: '$4', width: '100%', height: 44 }}>
          Generate
        </Button>
        <Flex css={{ mt: '$3' }} align={'center'} justify={'center'} gap={'2'}>
          <Text color={'gray'}>Check this website repo at</Text>
          <Link target="_blank" href={'https://github.com/fefezoka/lastfmcharts'}>
            <FaGithub />
          </Link>
        </Flex>
      </Box>
    </Flex>
  );
}
