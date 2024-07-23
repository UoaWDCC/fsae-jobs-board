import { Card, Image, Text, Badge, Button, Group } from '@mantine/core';
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
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: '25rem' }}>
      {/* Job Title */}
      <Text fw={500} size="lg" className={classes.text}>
        {data.title}
      </Text>

      {/* Job Description */}
      <Text fw={500} size="lg" className={classes.text}>
        {data.subtitle}
      </Text>

      {/* Job Description */}
      <Text fw={700} size="sm" className={classes.text}>
        {data.description}
      </Text>

      <Button
        color="blue"
        fullWidth
        mt="md"
        radius="md"
        onClick={() => {
          window.open(data.jobLink, '_blank');
        }}
      >
        View Job
      </Button>

      {/* Job Description */}
      <Text fw={700} size="sm" className={classes.text}>
        #{data.jobID}
      </Text>
    </Card>
  );
}
