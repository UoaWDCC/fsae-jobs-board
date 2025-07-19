import { Card, Text, Button, Flex } from '@mantine/core';
import { FC } from 'react';
import { useNavigate } from 'react-router-dom';

// TODO Change to job.model.ts 
interface JobListingItemProps {
  id: string; //added id prop for navigation
  title: string;
  description: string;
  company: string;
  location: string;
  logo: string;
}

const JobListingItem: FC<JobListingItemProps> = ({ id, title, description, company, location, logo }) => {
  const navigate = useNavigate();

  const handleViewDetails = () => {
    navigate(`/jobs/${id}`);
  };

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Flex justify="space-between" align="center">
        <Flex direction="column" gap="xs">
          {/* <Text fw={700} size="lg">{id} - ID is temporary</Text> */}
          <Text fw={700} size="lg">{title}</Text>
          <Text color="dimmed" size="sm">{company} ・ {location}</Text>
          <Text size="sm" lineClamp={3}>{description}</Text>
        </Flex>
        <img src={logo || "/WDCCLogo.png"} alt="Company Logo" width={60} height={60} style={{ borderRadius: '50%' }} />
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
