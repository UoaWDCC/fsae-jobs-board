import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Center, Container, Title, Text, Paper, Loader, Flex, Button } from '@mantine/core';
import { Job } from '@/models/job.model';
import { fetchJobById } from '@/api/job';
import { JobDetail } from '@/app/components/JobDetail/JobDetail';
import { useProfileCompletionGuard } from '../../../hooks/useProfileCompletionGuard';

export function JobDetailsPage() {
  useProfileCompletionGuard();
  
  const { id } = useParams();
  const navigate = useNavigate();
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
        <Flex justify="center" mb="md">
          <Button size="lg" onClick={() => navigate('/jobs')}>
            ← Back to Job Board
          </Button>
        </Flex>
        <JobDetail job={{
          ...job!,
          duration: job!.duration ?? '',
          location: job!.location ?? '',
          startDate: job!.startDate ?? '',
        }} />
      </Container>
    </Center>
  );
}
