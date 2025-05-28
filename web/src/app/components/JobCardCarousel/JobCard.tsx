import { ActionIcon, Text, Button, Paper, Flex, Stack } from '@mantine/core';
import styles from './JobCard.module.css';
import { IconTrash } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '@/app/store';

export interface JobCardProps {
  title: string;
  subtitle: string;
  description: string;
  jobLink: string;
  jobID: string;
}

export function JobCard({ data }: { data: JobCardProps }) {
  const navigate = useNavigate();
  const role = useSelector((state: RootState) => state.user.role);

  const handleDeleteJob = () => {
    console.log('Delete job with ID: ', data.jobID);
  };

  const handleEditJob = () => {
    console.log('Edit job with ID: ', data.jobID);
  };

  const handleViewJob = () => {
    navigate(`/jobs/${data.jobID}`);
  };

  const getElementBasedOnRole = (element: string) => {
    switch (role) { 
      case 'member':
        return getStudentElements(element);
      case 'sponsor':
        return getSponsorElements(element);
      case 'alumni':
        return getAlumniElements(element);
      case 'admin':
        return getSponsorElements(element);
    }
  };

  const getSponsorElements = (element: string) => {
    switch (element) {
      case 'deleteBtn':
        return (
          <ActionIcon variant="transparent" color="white" onClick={handleDeleteJob}>
            <IconTrash />
          </ActionIcon>
        );
      case 'jobBtn':
        return (
          <Button
            color="blue"
            mt="xs"
            mr="md"
            radius="lg"
            size="compact-md"
            onClick={handleEditJob}
          >
            Edit Job
          </Button>
        );
    }
  };

  const getStudentElements = (element: string) => {
    switch (element) {
      case 'deleteBtn':
        return null;
      case 'jobBtn':
        return (
          <Button
            color="blue"
            mt="xs"
            mr="md"
            radius="lg"
            size="compact-md"
            onClick={handleViewJob}
          >
            View Job
          </Button>
        );
    }
  };

  const getAlumniElements = (element: string) => {
    switch (element) {
      case 'deleteBtn':
        return null;
      case 'jobBtn':
        return (
          <Button
            color="blue"
            mt="xs"
            mr="md"
            radius="lg"
            size="compact-md"
            onClick={handleViewJob}
          >
            View Job
          </Button>
        );
    }
  };

  return (
    <Paper p="md" radius="md">
      <Flex direction="column">
        <Stack gap="xs">
          <Flex justify={'space-between'}>
            <Text fw={500} size="xl" className={styles.text}>
              {data.title}
            </Text>
            {getElementBasedOnRole('deleteBtn')}
          </Flex>

          <Text fw={500} size="md" className={styles.text}>
            {data.subtitle}
          </Text>

          <Text fw={700} size="sm" className={styles.text} lineClamp={3}>
            {data.description}
          </Text>
        </Stack>

        <Flex justify="flex-end" mb="xs">
          {getElementBasedOnRole('jobBtn')}
        </Flex>

        <Flex justify="flex-end">
          <Text c={'#7C7C7C'} size="sm" className={styles.text}>
            #{data.jobID}
          </Text>
        </Flex>
      </Flex>
    </Paper>
  );
}
