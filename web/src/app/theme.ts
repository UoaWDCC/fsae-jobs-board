import { Modal, TextInput, Textarea, colorsTuple, createTheme, rem } from '@mantine/core';

const customAzureBlue = colorsTuple('#0091ff');
const customDarkBlue = colorsTuple('#00467f');
const customPapayaOrange = colorsTuple('#f78f1f');
const customElectricOrange = colorsTuple('#ff8400');
const customCharcoalGrey = colorsTuple('#373737');
const customMercurySilver = colorsTuple('#a5a5a5');
const customOrange = colorsTuple('#f55442');
const background = colorsTuple('#000000');
const customGrey = colorsTuple('#545454');
const customWhite = colorsTuple('#ffffff');

export const theme = createTheme({
  colors: {
    customAzureBlue,
    customDarkBlue,
    customPapayaOrange,
    customElectricOrange,
    customCharcoalGrey,
    customMercurySilver,
    customOrange,
    background,
    customGrey,
    customWhite,
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

  components: {
    TextInput: TextInput.extend({
      styles: (theme) => ({
        input: {
          backgroundColor: theme.colors.customWhite[0],
        },
      }),
    }),
    Textarea: Textarea.extend({
      styles: (theme) => ({
        input: {
          backgroundColor: theme.colors.customWhite[0],
        },
      }),
    }),
  },
});

/**
 * Color:
 * to use any color, use format of var(--mantine-color-colorName-1) where colorName is defined in theme.ts
 * e.g. color: var(--mantine-color-customAzureBlue-1)
 *
 * for very basic colors such as black and white, use mantine-color-black and mantine-color-white
 * do not use hard coded color such as hex or rgb since all colors are defined here. for transparency, use alpha() function provided by mantine https://mantine.dev/styles/color-functions/
 *
 *
 * Heading:
 * to have headings, use <Title> component with order prop. The order prop corresponds to the heading number
 * e.g. <Title order={1}>This is title></Title> is a title component of with h1 styling (see above)
 *
 *
 * Text:
 * if you dont want heading, use normal <Text>  component with size with size of xs, sm, md, lg, xl
 * e.g. <Text size="xs">This is a text</Text> is a text component with extra small size
 *
 *
 * checkout Welcome component to see how things are applied.
 * for general styling of individual component, check out mantine core for component usage (e.g. https://mantine.dev/core/text/). This page should only focus on the overall theme of the project. :))
 *
 * */
