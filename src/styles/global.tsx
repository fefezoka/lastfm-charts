import { globalCss } from 'stitches.config';

import { Roboto } from 'next/font/google';

const poppins = Roboto({
  weight: ['400', '500', '700'],
  subsets: ['latin'],
});

export const global = globalCss({
  '*': {
    margin: 0,
    padding: 0,
    boxSizing: 'border-box',
    fontFamily: poppins.style.fontFamily,
  },

  body: {
    backgroundColor: '$bg1',
    color: '$slate12',
  },

  a: {
    all: 'unset',
    cursor: 'pointer',
  },

  button: {
    all: 'unset',
    cursor: 'pointer',
  },

  li: {
    listStyle: 'none',
  },

  input: {
    border: 'none',
  },

  'input:focus': {
    outline: 'none',
  },

  '::-webkit-scrollbar': {
    width: '1rem',
  },

  '::-webkit-scrollbar-track': {
    backgroundColor: '$bg2',
  },

  '::-webkit-scrollbar-thumb': {
    backgroundColor: '$bg3',
  },
});
