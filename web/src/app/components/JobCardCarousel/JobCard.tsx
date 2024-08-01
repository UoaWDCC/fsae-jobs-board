import { ActionIcon, Text, Button, Paper, Flex, Stack } from '@mantine/core';
import classes from './JobCard.module.css';
import { useState } from 'react';
import { UserType } from '@/app/features/user/userSlice';
import { IconTrash } from '@tabler/icons-react';
// dummy data -- change later when we have real data
export interface JobCardProps {
  title: string;
  subtitle: string;
  description: string;
  jobLink: string;
  jobID: string;
}

export function JobCard({ data }: { data: JobCardProps }) {
  // const userType = useSelector((state: RootState) => state.user.userType);
  const [userType, setUserType] = useState<UserType>('sponsor');

  console.log(
    'Change this JobCard component to use real userType from Redux store once user integration is implemented'
  );

  const handleDeleteJob = () => {
    console.log('Delete job with ID: ', data.jobID);
  };

  const handleEditJob = () => {
    console.log('Edit job with ID: ', data.jobID);
  };

  const handleViewJob = () => {
    console.log('View job with ID: ', data.jobID);
  };

  // methods to get elements based on user type
  const getElementBasedOnUserType = (element: string) => {
    switch (userType) {
      case 'sponsor':
        return getSponsorElements(element);
      case 'student':
        return getStudentElements(element);
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
        {/* Job Title */}
        <Stack gap="xs">
          <Flex justify={'space-between'}>
            <Text fw={500} size="xl" className={classes.text}>
              {data.title}
            </Text>
            {getElementBasedOnUserType('deleteBtn')}
          </Flex>

          {/* Job Subtite */}
          <Text fw={500} size="md" className={classes.text}>
            {data.subtitle}
          </Text>

          {/* Job Description */}
          <Text fw={700} size="sm" className={classes.text} lineClamp={3}>
            {data.description}
          </Text>
        </Stack>

        <Flex justify="flex-end" mb="xs">
          {getElementBasedOnUserType('jobBtn')}
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
