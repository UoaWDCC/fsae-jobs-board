import { Flex, Box, Text, Button, BackgroundImage, Center, Anchor, Space } from '@mantine/core';
import classes from './FindOutMore.module.css';

export function FindOutMore() {
  return (
    <Box className={classes.container}>
      <BackgroundImage className={classes.backgroundImage} src="E47.jpg" />
      <Flex
        align="Center"
        justify="Center"
        direction="column"
        gap="xl"
        mt={{ base: '-35rem', sm: '-25rem' }}
        ml={{ base: '50', sm: '200' }}
        mr={{ base: '50', sm: '200' }}
        className={classes.textBox}
      >
        <Text fz={{ base: 'md', sm: 'xl' }} lh={{ base: 'md', sm: 'xl' }} className={classes.text}>
          Your one-stop shop for connecting F:SAE:47 members, sponsors, and alumni! Whether you're a
          student seeking your dream internship or graduate role, a sponsor, or an alumnus looking
          to connect your company with the next generation of innovators, this platform is designed
          to streamline your job search and talent acquisition. For more info on the F:SAE:47 club
          and its mission, visit our{' '}
          <Anchor
            fz={{ base: 'md', sm: 'xl' }}
            href="https://www.fsae.co.nz/"
            target="_blank"
            underline="hover"
          >
            official website
          </Anchor>
          .
        </Text>
        <Button
          component="a"
          href="https://www.fsae.co.nz/"
          size="lg"
          radius={100}
          fw={0}
          color="var(--mantine-color-customAzureBlue-1)"
        >
          Find out more
        </Button>
      </Flex>
    </Box>
  );
}
