import { BackgroundImage, Box, Flex, Title } from '@mantine/core';
import classes from './Welcome.module.css';

export function Welcome() {
  return (
    <Box mx="auto" className={classes.HomePage}>
      <BackgroundImage src="home_background.jpg" className={classes.BackgroundImage}>
        <Flex justify="center" align="flex-end" style={{ height: '100vh' }}>
          <Title size="2rem" textWrap="wrap" style={{ color: 'white', fontStyle: 'italic' }}>
            Welcome to the University of Auckland F:SAE:47 Job Board
          </Title>
        </Flex>
      </BackgroundImage>
    </Box>
  );
}
