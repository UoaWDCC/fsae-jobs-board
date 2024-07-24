import {
  Card,
  Image,
  Text,
  Badge,
  Button,
  Group,
  Paper,
  Box,
  Flex,
  Stack,
  rem,
} from '@mantine/core';
import classes from './JobCard.module.css';
// dummy data -- change later when we have real data
export interface JobCardProps {
  title: string;
  subtitle: string;
  description: string;
  jobLink: string;
  jobID: string;
}

export function JobCard({ data }: { data: JobCardProps }) {
  return (
    <Paper p="md" radius="md">
      <Flex direction="column">
        {/* Job Title */}
        <Stack gap="xs">
          <Text fw={500} size="xl" className={classes.text}>
            {data.title}
          </Text>

          {/* Job Subtite */}
          <Text fw={500} size="xs" className={classes.text}>
            {data.subtitle}
          </Text>

          {/* Job Description */}
          <Text fw={700} size="sm" className={classes.text} lineClamp={3}>
            {data.description}
          </Text>
        </Stack>

        <Flex justify="flex-end" mb="xs">
          <Button
            color="blue"
            mt="xs"
            mr="md"
            radius="lg"
            size="compact-md"
            onClick={() => {
              window.open(data.jobLink, '_blank');
            }}
          >
            View Job
          </Button>
        </Flex>

        {/* Job ID */}
        <Flex justify="flex-end">
          <Text c={'#7C7C7C'} size="sm" className={classes.text}>
            #{data.jobID}
          </Text>
        </Flex>
      </Flex>
    </Paper>
  );
}
