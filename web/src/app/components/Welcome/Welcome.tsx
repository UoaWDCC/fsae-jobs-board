import { BackgroundImage, Box, Flex, Title } from '@mantine/core';
import styles from './Welcome.module.css';

export function Welcome() {
  return (
    <Box mx="auto" className={styles.HomePage}>
      <BackgroundImage src="home_background.jpg" className={styles.BackgroundImage}>
        <Flex justify="center" align="flex-end" className={styles.titleContainer}>
          <Title
            fz={{ base: '1.5rem', sm: '2rem' }}
            lh={{ base: 'md', sm: 'xl' }}
            textWrap="wrap"
            mb={50}
            className={styles.title}
          >
            Welcome to the University of Auckland F:SAE:47 Job Board
          </Title>
        </Flex>
      </BackgroundImage>
    </Box>
  );
}
