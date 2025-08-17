import { ActionIcon, Text, Button, Paper, Flex, Stack, Badge } from '@mantine/core';
import styles from './JobCard.module.css';
import { IconTrash } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '@/app/store';
import { deleteJob } from '@/api/job';
import { toast } from 'react-toastify';

export interface JobCardProps {
  id: string;
  title: string;
  specialisation: string;
  description: string;
  roleType: string;
  salary?: string;
  applicationDeadline: string;
  datePosted: string;
  publisherID: string;
}

export function JobCard({ data, onJobDeleted, onEditJob }: { 
  data: JobCardProps; 
  onJobDeleted?: () => void;
  onEditJob?: (jobData: JobCardProps) => void;
}) {
  const navigate = useNavigate();
  const role = useSelector((state: RootState) => state.user.role);

  const handleDeleteJob = async () => {
    if (window.confirm(`Are you sure you want to delete the job "${data.title}"?`)) {
      try {
        await deleteJob(data.id);
        toast.success('Job deleted successfully!');
        onJobDeleted?.();
      } catch (error) {
        console.error('Failed to delete job:', error);
        toast.error('Failed to delete job. Please try again.');
      }
    }
  };

  const handleEditJob = () => {
    if (onEditJob) {
      // Call the edit callback with job data for autofilling
      onEditJob(data);
    } else {
      // Fallback to navigation if no callback provided
      console.log('Edit job with ID: ', data.id);
      navigate(`/jobs/${data.id}?edit=true`);
    }
  };

  const handleViewJob = () => {
    navigate(`/jobs/${data.id}`);
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
          <ActionIcon
            variant="transparent"
            color="white"
            onClick={handleDeleteJob}>
            <IconTrash 
            aria-label = "Delete Job"/>
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

  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
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

          <Flex gap="xs" align="center">
            <Badge color="blue" variant="light">
              {data.roleType}
            </Badge>
            <Badge color="green" variant="light">
              {data.specialisation}
            </Badge>
            {data.salary && (
              <Badge color="orange" variant="light">
                {data.salary}
              </Badge>
            )}
          </Flex>

          <Text fw={700} size="sm" className={styles.text} lineClamp={3}>
            {data.description}
          </Text>

          <Flex justify="space-between" align="center">
            <Text size="xs" c="dimmed">
              Posted: {formatDate(data.datePosted)}
            </Text>
            <Text size="xs" c="dimmed">
              Deadline: {formatDate(data.applicationDeadline)}
            </Text>
          </Flex>
        </Stack>

        <Flex justify="flex-end" mb="xs">
          {getElementBasedOnRole('jobBtn')}
        </Flex>

        <Flex justify="flex-end">
          <Text c={'#7C7C7C'} size="sm" className={styles.text}>
            #{data.id}
          </Text>
        </Flex>
      </Flex>
    </Paper>
  );
}
