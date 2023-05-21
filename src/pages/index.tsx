import React, { useEffect, useId } from 'react';
import Link from 'next/link';
import { z } from 'zod';
import { useRouter } from 'next/router';
import { Control, useForm, FieldValues } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Box, Button, Flex, Grid, Heading, Input, Select } from '@styles';

const formSchema = z.object({
  username: z.string().nonempty(),
  type: z.enum(['albums', 'artists', 'tracks']),
  period: z.enum(['7day', '1month', '3month', '6month', '1year', 'overall']),
  format: z.object({
    value: z.enum(['3x3', '4x4', '5x4', '5x5', '6x6', '8x6', '8x8']),
    label: z.enum(['3x3', '4x4', '5x4', '5x5', '6x6', '8x6', '8x8']),
  }),
});

export type FormData = z.infer<typeof formSchema>;

export default function Home() {
  const router = useRouter();
  const { control, register, setValue, handleSubmit, watch } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  useEffect(() => {
    const data = window.localStorage.getItem('previousChart');
    if (!data) {
      return;
    }
    const previous = JSON.parse(data) as FormData;
    setValue('format', previous.format);
    setValue('period', previous.period);
    setValue('type', previous.type);
    setValue('username', previous.username);
  }, [setValue]);

  const handleGenerateChart = (data: FormData) => {
    window.localStorage.setItem('previousChart', JSON.stringify(data));

    router.push({
      pathname: '/chart',
      query: {
        username: data.username,
        type: data.type,
        format: data.format.value,
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
        Last Charts
      </Heading>
      <Box css={{ ta: 'center' }}>
        <Heading size="3">
          Crie charts personalizadas com seus scrobbles do{' '}
          <Link href={'https://last.fm'}>
            <Heading size="3" as={'span'} gradient color={'red'}>
              Last.fm
            </Heading>
          </Link>
        </Heading>
      </Box>
      <Box as={'form'} css={{ mt: 32 }}>
        <Box>
          <Heading>Digite seu nome de usuário no Last.fm</Heading>
          <Input {...register('username')} css={{ width: '100%', mt: '$1' }} />
        </Box>
        <Box css={{ mt: '$3' }}>
          <Heading>Qual o tipo de chart?</Heading>
          <Grid columns={'3'} gap={'3'} css={{ mt: '$1' }} justify={'between'}>
            <Button
              active={watch('type') === 'albums'}
              onClick={() => setValue('type', 'albums')}
              defaultChecked
            >
              Albuns
            </Button>
            <Button
              active={watch('type') === 'artists'}
              onClick={() => setValue('type', 'artists')}
            >
              Artistas
            </Button>
            <Button
              active={watch('type') === 'tracks'}
              onClick={() => setValue('type', 'tracks')}
            >
              Músicas
            </Button>
          </Grid>
        </Box>
        <Box css={{ mt: '$3' }}>
          <Heading>Qual o período?</Heading>
          <Grid columns={'3'} css={{ mt: '$1' }} gap={'3'} justify={'between'}>
            <Button
              active={watch('period') === '7day'}
              onClick={() => setValue('period', '7day')}
            >
              1 Semana
            </Button>
            <Button
              active={watch('period') === '1month'}
              onClick={() => setValue('period', '1month')}
            >
              1 Mês
            </Button>
            <Button
              active={watch('period') === '3month'}
              onClick={() => setValue('period', '3month')}
            >
              3 Meses
            </Button>
            <Button
              active={watch('period') === '6month'}
              onClick={() => setValue('period', '6month')}
            >
              6 Meses
            </Button>
            <Button
              active={watch('period') === '1year'}
              onClick={() => setValue('period', '1year')}
            >
              1 Ano
            </Button>
            <Button
              active={watch('period') === 'overall'}
              onClick={() => setValue('period', 'overall')}
            >
              Todo período
            </Button>
          </Grid>
        </Box>
        <Box css={{ mt: '$3' }}>
          <Heading>Qual o formato?</Heading>
          <Select
            id={useId()}
            control={control as unknown as Control<FieldValues>}
            name="format"
            placeholder={'Selecione o formato'}
            options={[
              { value: '3x3', label: '3x3' },
              { value: '4x4', label: '4x4' },
              { value: '5x4', label: '5x4' },
              { value: '5x5', label: '5x5' },
              { value: '6x6', label: '6x6' },
              { value: '8x6', label: '8x6' },
              { value: '8x8', label: '8x8' },
            ]}
          />
        </Box>
        <Button type="submit" css={{ mt: '$4', width: '100%', height: 44 }}>
          Enviar
        </Button>
      </Box>
    </Flex>
  );
}
