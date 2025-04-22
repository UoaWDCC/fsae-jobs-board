import { Card, Image, Text, Button, Flex } from '@mantine/core';
import { FC } from 'react';

interface JobListingItemProps {
  title: string;
  description: string;
  company: string;
  location: string;
  logo: string;
}

const JobListingItem: FC<JobListingItemProps> = ({ title, description, company, location, logo }) => {
  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Flex justify="space-between" align="center">
        <Flex direction="column" gap="xs">
          <Text fw={700} size="lg">{title}</Text>
          <Text color="dimmed" size="sm">{company} ・ {location}</Text>
          <Text size="sm" lineClamp={3}>{description}</Text>
        </Flex>
        <Image src={`/logos/${logo}`} alt="Company Logo" width={60} height={60} radius="xl" fallbackSrc="/logos/default.png" />
      </Flex>
      <Flex justify="flex-end" mt="md">
        <Button variant="light" color="blue" size="sm">View Details</Button>
      </Flex>
    </Card>
  );
};

export default JobListingItem;
