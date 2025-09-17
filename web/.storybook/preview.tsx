import '@mantine/core/styles.css';
import React from 'react';
import { MantineProvider } from '@mantine/core';
import { theme } from '../src/app/theme';

export const decorators = [
  (Story: any) => (
    <MantineProvider theme={theme}>
      <Story />
    </MantineProvider>
  ),
];

export const parameters = {
  themes: {
    default: 'light',
    list: [
      { name: 'light', class: 'light', color: '#ffffff' },
      { name: 'dark', class: 'dark', color: '#1a1b1e' }
    ],
  },
};