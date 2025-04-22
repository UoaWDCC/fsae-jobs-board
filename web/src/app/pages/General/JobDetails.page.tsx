import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Container, Title, Text, Paper, Loader, Flex } from '@mantine/core';

interface JobAd {
  id: string;
  title: string;
  description: string;
  applicationLink: string;
  applicationDeadline: string;
  datePosted: string;
  specialisation: string;
  salary: string;
  publisherID: string;
}

export function JobDetailsPage() {
  const { id } = useParams();
  const [job, setJob] = useState<JobAd | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const response = await fetch(`http://localhost:3000/job/${id}`);
        if (!response.ok) throw new Error('Job not found');
        const data = await response.json();
        setJob(data);
      } catch (err) {
        setError('Failed to load job details.');
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchJob();
  }, [id]);

  if (loading) return <Loader />;
  if (error) return <Text color="red">{error}</Text>;
  if (!job) return <Text>No job found.</Text>;

  return (
    <Container size="md">
      <Paper p="md" shadow="sm" radius="md">
        <Title order={2} mb="sm">{job.title}</Title>
        <Text size="md" mb="xs">Specialisation: {job.specialisation}</Text>
        <Text size="md" mb="xs">Salary: {job.salary}</Text>
        <Text size="md" mb="xs">Deadline: {new Date(job.applicationDeadline).toLocaleDateString()}</Text>
        <Text size="md" mb="sm">Posted: {new Date(job.datePosted).toLocaleDateString()}</Text>
        <Text size="sm" color="dimmed" mb="md">Publisher ID: {job.publisherID}</Text>
        <Text>{job.description}</Text>

        <Flex justify="flex-end" mt="lg">
          <a href={job.applicationLink} target="_blank" rel="noopener noreferrer">
            <Text color="blue" fw={500}>Apply Now →</Text>
          </a>
        </Flex>
      </Paper>
    </Container>
  );
}
