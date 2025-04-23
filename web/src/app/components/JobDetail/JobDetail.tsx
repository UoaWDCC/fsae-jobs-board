import { Container, Grid, Stack, Text, Title, Button, Badge, Paper, Group, Divider } from '@mantine/core';
import { IconExternalLink } from '@tabler/icons-react';
import { Job } from '@/models/job.model';
import styles from './JobDetail.module.css';

export function JobDetail({ job }: { job: Job }) {
  return (
    <Container className={styles.container} py="md">
      <Paper withBorder shadow="sm" p="lg" radius="md">
        <Grid>
          {/* Left Column */}
          <Grid.Col span={{ base: 12, md: 4 }}>
            <Stack>
              <Text className={styles.bodyText}>
                <strong>Salary:</strong> {job.salary}
              </Text>
              <Text className={styles.bodyText}>
                <strong>Deadline:</strong> {job.applicationDeadline}
              </Text>

              <Divider my="sm" />

              <div>
                <Text component="h3" className={styles.heading} mb={4}>
                  Specialisation and Skills
                </Text>
                <Text className={styles.bodyText}>{job.specialisation}</Text>
              </div>
            </Stack>
          </Grid.Col>

          {/* Right Column */}
          <Grid.Col span={{ base: 12, md: 8 }}>
            <Stack>
              <Group justify="space-between" align="center">
                <Title className={styles.subtitle} order={2}>
                  {job.title}
                </Title>
                <Badge color="blue" size="md" radius="sm">WDCC</Badge>
              </Group>

              <Group>
                <Button
                  className={styles.button}
                  component="a"
                  href={job.applicationLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  leftSection={<IconExternalLink size={16} />}
                >
                  Apply
                </Button>
                <Button className={styles.button} variant="outline">
                  Save
                </Button>
              </Group>

              <Divider />

              <div>
                <Text component="h3" className={styles.heading} mb={4}>
                  About
                </Text>
                <Text className={styles.bodyText}>
                  {job.description}
                </Text>
                <Text className={styles.smallText} mt="xs">
                  Posted on: {job.datePosted}
                </Text>
              </div>

              <Text className={styles.bodyText} mt="md">
                If you are passionate about software development and eager to kick-start your career in a dynamic and innovative environment, we encourage you to apply for this exciting opportunity. Join us and be part of a team that's shaping the future of technology.
              </Text>
            </Stack>
          </Grid.Col>
        </Grid>
      </Paper>
    </Container>
  );
}