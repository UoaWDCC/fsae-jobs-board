import { ActionIcon, Text, Button, Paper, Flex, Stack, Badge, Group } from '@mantine/core';
import styles from './JobCard.module.css';
import { IconTrash, IconEdit } from '@tabler/icons-react';
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
  const userId = useSelector((state: RootState) => state.user.id);
  
  const timeSince = (past: Date) => {
    const now = new Date();
    let seconds = Math.floor((now.getTime() - past.getTime()) / 1000);
    const intervals = [
      { label: 'year', seconds: 31536000 },
      { label: 'month', seconds: 2592000 },
      { label: 'day', seconds: 86400 },
      { label: 'hour', seconds: 3600 },
      { label: 'minute', seconds: 60 },
    ];
    for (const it of intervals) {
      const count = Math.floor(seconds / it.seconds);
      if (count >= 1) {
        return `${count} ${it.label}${count > 1 ? 's' : ''} ago`;
      }
    }
    return 'just now';
  };

  let isExpired = false;
  let expiredLabel = '';
  if (data.applicationDeadline) {
    const parsed = Date.parse(data.applicationDeadline);
    if (!isNaN(parsed)) {
      const startOfToday = new Date();
      startOfToday.setHours(0, 0, 0, 0);
      if (parsed < startOfToday.getTime()) {
        isExpired = true;
        expiredLabel = `Expired ${timeSince(new Date(parsed))}`;
      }
    }
  }

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
    // Check if user can edit this job
    const canEdit = role === 'sponsor' || role === 'alumni';
    const isOwner = userId && data.publisherID === userId;
    
    if (!canEdit) {
      toast.error('You do not have permission to edit jobs');
      return;
    }
    
    if (!isOwner) {
      toast.error('You can only edit your own job posts');
      return;
    }

    navigate(`/job-editor/${data.id}`);
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
    const isOwner = userId && data.publisherID === userId;

    switch (element) {
      case 'deleteBtn':
        return isOwner ? (
          <ActionIcon
            variant="transparent"
            color="white"
            onClick={handleDeleteJob}>
            <IconTrash
            aria-label = "Delete Job"/>
          </ActionIcon>
        ) : null;
      case 'jobBtn':
        return isOwner ? (
          <Group gap="xs">
            <Button
              color="blue"
              mt="xs"
              radius="lg"
              size="compact-md"
              onClick={handleViewJob}
            >
              View Job
            </Button>
            <Button
              color="blue"
              mt="xs"
              radius="lg"
              size="compact-md"
              variant="light"
              onClick={handleEditJob}
              leftSection={<IconEdit size={14} />}
            >
              Edit
            </Button>
          </Group>
        ) : (
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
    const isOwner = userId && data.publisherID === userId;

    switch (element) {
      case 'deleteBtn':
        return isOwner ? (
          <ActionIcon
            variant="transparent"
            color="white"
            onClick={handleDeleteJob}>
            <IconTrash
            aria-label = "Delete Job"/>
          </ActionIcon>
        ) : null;
      case 'jobBtn':
        return isOwner ? (
          <Group gap="xs">
            <Button
              color="blue"
              mt="xs"
              radius="lg"
              size="compact-md"
              onClick={handleViewJob}
            >
              View Job
            </Button>
            <Button
              color="blue"
              mt="xs"
              radius="lg"
              size="compact-md"
              variant="light"
              onClick={handleEditJob}
              leftSection={<IconEdit size={14} />}
            >
              Edit
            </Button>
          </Group>
        ) : (
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
    <Paper p="md" radius="md" style={{ opacity: isExpired ? 0.75 : 1 }}>
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
            {isExpired && (
              <Badge color="red" variant="filled">
                {expiredLabel}
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
