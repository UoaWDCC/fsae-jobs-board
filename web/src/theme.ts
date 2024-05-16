import { MantineColorsTuple, colorsTuple, createTheme, rem } from '@mantine/core';

const customAzureBlue = colorsTuple('#0091ff');
const customDarkBlue = colorsTuple('#00467f');
const customPapayaOrange = colorsTuple('#f78f1f');
const customElectricOrange = colorsTuple('#ff8400');
const customCharcoalGrey = colorsTuple('#373737');
const customMercurySilver = colorsTuple('#a5a5a5');

export const theme = createTheme({
  colors: {
    customAzureBlue,
    customDarkBlue,
    customPapayaOrange,
    customElectricOrange,
    customCharcoalGrey,
    customMercurySilver,
  },
  fontFamily: 'Cerebri Sans, Calibri',

  headings: {
    fontFamily: 'Cerebri Sans, Calibri',
    sizes: {
      h1: { fontSize: rem(70) },
      h2: { fontSize: rem(60) },
      h3: { fontSize: rem(50) },
      h4: { fontSize: rem(40) },
      h5: { fontSize: rem(30) },
      h6: { fontSize: rem(20) },
    },
  },
});
