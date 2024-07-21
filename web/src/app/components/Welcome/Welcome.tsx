import { BackgroundImage, Box, Flex, Title } from '@mantine/core';
import classes from './Welcome.module.css';

export function Welcome() {
  return (
    <Box mx="auto" className={classes.HomePage}>
      <BackgroundImage src="home_background.jpg" className={classes.BackgroundImage}>
        <Flex justify="center" align="flex-end" className={classes.titleContainer}>
          <Title
            fz={{ base: '1.5rem', sm: '2rem' }}
            lh={{ base: 'md', sm: 'xl' }}
            textWrap="wrap"
            mb={50}
            className={classes.title}
          >
            Welcome to the University of Auckland F:SAE:47 Job Board
          </Title>
        </Flex>
      </BackgroundImage>
    </Box>
  );
}
