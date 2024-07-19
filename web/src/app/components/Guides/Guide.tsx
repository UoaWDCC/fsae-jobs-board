import { Center, Title, Text, Flex, Space, Button, Box } from '@mantine/core';
import { IconArrowRight } from '@tabler/icons-react';
import { useScrollIntoView } from '@mantine/hooks';
import classes from './Guides.module.css';

type GuideProps = {
  title: string;
  subtitle1: string;
  description1: string;
  subtitle2: string;
  description2: string;
  subtitle3: string;
  description3: string;
  buttonText: string;
};

export function Guide({
  title,
  subtitle1,
  description1,
  subtitle2,
  description2,
  subtitle3,
  description3,
  buttonText,
}: GuideProps) {
  const { scrollIntoView, targetRef } = useScrollIntoView<HTMLDivElement>();

  return (
    <Flex
      gap={{ base: 20, sm: 150 }}
      justify="center"
      align="center"
      direction="column"
      wrap="wrap"
      className={classes.wrapper}
    >
      <Box>
        <Title ref={targetRef}>{title}</Title>
      </Box>

      <Flex gap="xl" direction={{ base: 'column', sm: 'row' }}>
        <Box className={classes.card}>
          <Text size="xl" fw={700}>
            {subtitle1}
          </Text>
          <Text>{description1}</Text>
        </Box>
        <Box className={classes.card}>
          <Text size="xl" fw={700}>
            {subtitle2}
          </Text>
          <Text>{description2}</Text>
        </Box>
        <Box className={classes.card}>
          <Text size="xl" fw={700}>
            {subtitle3}
          </Text>
          <Text>{description3}</Text>
        </Box>
      </Flex>

      <Button size="lg" radius={100} fw={0}>
        {buttonText} <IconArrowRight></IconArrowRight>
      </Button>
    </Flex>
  );
}
