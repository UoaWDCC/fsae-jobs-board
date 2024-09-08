import React, { forwardRef } from 'react';
import { Title, Text, Flex, Button, Box } from '@mantine/core';
import { IconArrowRight } from '@tabler/icons-react';
import styles from './Guides.module.css';
import { NavLink } from 'react-router-dom';

type GuideProps = {
  title: string;
  subtitle1: string;
  description1: string;
  subtitle2: string;
  description2: string;
  subtitle3: string;
  description3: string;
  buttonText: string;
  useRef: string;
};

// Forward ref to the Guide component
export const Guide = forwardRef<HTMLDivElement, GuideProps>(({
  title,
  subtitle1,
  description1,
  subtitle2,
  description2,
  subtitle3,
  description3,
  buttonText,
  useRef,
}, ref) => {
  return (
    <Flex
      gap={{ base: 20, sm: 150 }}
      justify="center"
      align="center"
      direction="column"
      wrap="wrap"
      className={styles.wrapper}
      ref={ref} // Attach ref to the Flex container
    >
      <Box>
        <Title>{title}</Title>
      </Box>

      <Flex gap={{ base: '50', sm: '125' }} direction={{ base: 'column', sm: 'row' }}>
        <Box className={styles.card}>
          <Box mt={-140} className={styles.greyCircle}>
            <Title ta="center" order={4} fw={800}>
              1
            </Title>
          </Box>

          <Text ta="center" size="xl" fw={700}>
            {subtitle1}
          </Text>
          <Text ta="center">{description1}</Text>
        </Box>
        <Box className={styles.card}>
          <Box mt={-140} className={styles.orangeCircle}>
            <Title ta="center" order={4} fw={800}>
              2
            </Title>
          </Box>
          <Text ta="center" size="xl" fw={700}>
            {subtitle2}
          </Text>
          <Text ta="center">{description2}</Text>
        </Box>
        <Box className={styles.card}>
          <Box mt={-140} className={styles.greyCircle}>
            <Title ta="center" order={4} fw={800}>
              3
            </Title>
          </Box>
          <Text ta="center" size="xl" fw={700}>
            {subtitle3}
          </Text>
          <Text ta="center">{description3}</Text>
        </Box>
      </Flex>
      <NavLink to={useRef}>
        <Button size="lg" radius={100} fw={0} color="var(--mantine-color-customAzureBlue-1)">
          {buttonText} <IconArrowRight />
        </Button>
      </NavLink>
    </Flex>
  );
});
