// JobListingItem.ts
import { Card, Text, Button, Flex, Avatar } from '@mantine/core';
import { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { Job } from '@/models/job.model';
import { useUserAvatar } from '@/hooks/useUserAvatar';

interface JobListingItemProps {
  id: Job['id'];
  title: Job['title'];
  description: Job['description'];
  company: Job['publisherID'];
  location?: Job['location'];
  logo?: string;
}

const JobListingItem: FC<JobListingItemProps> = ({ id, title, description, company, location, logo }) => {
  const navigate = useNavigate();
  const { avatarUrl: posterAvatar } = useUserAvatar(company);

  const handleViewDetails = () => {
    navigate(`/jobs/${id}`);
  };

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Flex justify="space-between" align="center">
        <Flex direction="column" gap="xs">
          <Text fw={700} size="lg">{title}</Text>
          <Text color="dimmed" size="sm">{company} ・ {location}</Text>
          <Text size="sm" lineClamp={3}>{description}</Text>
        </Flex>
        <Avatar src={posterAvatar} alt={"Company Logo"} size={60} style={{ borderRadius: '50%' }} />
      </Flex>
      <Flex justify="flex-end" mt="md">
        <Button variant="light" color="blue" size="sm" onClick={handleViewDetails}>
          View Details
        </Button>
      </Flex>
    </Card>
  );
};

export default JobListingItem;