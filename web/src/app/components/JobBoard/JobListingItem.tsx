// JobListingItem.ts
import { Card, Text, Button, Flex, Badge, useMantineTheme } from '@mantine/core';
import { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { Job } from '@/models/job.model';

interface JobListingItemProps {
  id: Job['id'];
  title: Job['title'];
  description: Job['description'];
  company: Job['publisherID'];
  location?: Job['location'];
  logo?: string;
  isPostedByAlumni?: boolean;
}

const JobListingItem: FC<JobListingItemProps> = ({ id, title, description, company, location, logo, isPostedByAlumni }) => {
  const navigate = useNavigate();
  const theme = useMantineTheme();

  const handleViewDetails = () => {
    navigate(`/jobs/${id}`);
  };

  const handleBadgeClick = () => {
    navigate(`/profile/alumni/${company}`);
  }

  return (
    <Card
      shadow="sm"
      padding="lg"
      radius="md"
      withBorder
      style={{
        borderColor: isPostedByAlumni ? theme.colors.customPapayaOrange[1] : undefined,
        backgroundColor: isPostedByAlumni ? 'transparent' : undefined
      }}
    >
      <Flex justify="space-between" align="center">
        <Flex direction="column" gap="xs">
          <Text fw={700} size="lg">{title}</Text>
          <Text color="dimmed" size="sm">{company} ・ {location}</Text>
          <Text size="sm" lineClamp={3}>{description}</Text>
        </Flex>
        <img src={logo || "/WDCCLogo.png"} alt="Company Logo" width={60} height={60} style={{ borderRadius: '50%' }} />
      </Flex>
      <Flex justify={isPostedByAlumni ? "space-between" : "flex-end"} align="center" mt="md">
        {isPostedByAlumni && (
          <Badge
            color={theme.colors.customPapayaOrange[1]}
            onClick={handleBadgeClick}
            style={{
              cursor: 'pointer',
              color: theme.colors.background[0]
            }}
          >
            Alumni-posted
          </Badge>
        )}  
        <Button variant="light" color={isPostedByAlumni ? theme.colors.customPapayaOrange[1]: "blue"} size="sm" onClick={handleViewDetails}>
          View Details
        </Button>
      </Flex>
    </Card>
  );
};

export default JobListingItem;