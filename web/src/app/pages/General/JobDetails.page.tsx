import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Center, Container, Title, Text, Paper, Loader, Flex } from '@mantine/core';
import { Job } from '@/models/job.model';
import { fetchJobById } from '@/api/job';
import { JobDetail } from '@/app/components/JobDetail/JobDetail';

export function JobDetailsPage() {
  const { id } = useParams();
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const job = await fetchJobById(id as string);
        setJob(job);
      } catch (err) {
        setError(`Failed to load job details by id: ${id}`);
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
    <Center style={{ minHeight: '100vh' }}>
    <Container size="lg" py="md">
      <JobDetail job={job} />
    </Container>
  </Center>
  );
}
