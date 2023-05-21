# Lastfm Charts

Site para gerar charts personalizadas com base nas suas músicas escutadas

## Rodando localmente

Clonando o projeto e instalando as dependências

```bash
  git clone https://github.com/fefezoka/lastfmcharts
  cd showmaker
  npm install
```

Configurando o arquivo .env.example e iniciando o projeto

```bash
  # Copiar o arquivo contendo as variáveis de ambiente e dados de conexão
  cp .env.example .env

  # Rodar o projeto
  npm run dev
```

## Stack utilizada

- [Next JS](https://github.com/vercel/next.js/)
- [Typescript](https://github.com/microsoft/TypeScript)

## Bibliotecas

- [tRPC](https://github.com/trpc/trpc) - Rotas API typesafe
- [Stitches](https://github.com/stitchesjs/stitches) - CSS in JS
- [React Hook Form](https://github.com/react-hook-form) - Validação de formulários
- [Zod](https://github.com/colinhacks/zod) - Criação de schemas e validação
