import { Box, Title, Text, Badge, Stack, Loader, Paper, Anchor } from '@mantine/core';
import { useEffect, useState } from 'react';
import { getApplicantSubmissions, ApplicantSubmissionsResponse } from '@/api/tally';
import { useNavigate } from 'react-router-dom';

interface ApplicationHistoryProps {
  userId: string;
}

const STATUS_COLORS: Record<string, string> = {
  unread: 'blue',
  reviewed: 'gray',
  shortlisted: 'green',
  rejected: 'red',
};

export function ApplicationHistory({ userId }: ApplicationHistoryProps) {
  const [submissions, setSubmissions] = useState<ApplicantSubmissionsResponse['submissions']>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getApplicantSubmissions(userId);
        setSubmissions(response.submissions || []);
      } catch (err: any) {
        console.error('Error fetching application history:', err);
        setError('Failed to load application history');
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchSubmissions();
    }
  }, [userId]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const handleJobClick = (jobId: string) => {
    navigate(`/jobs/${jobId}`);
  };

  if (loading) {
    return (
      <Box style={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}>
        <Loader color="blue" size="sm" />
      </Box>
    );
  }

  if (error) {
    return (
      <Box>
        <Text size="sm" c="red">
          {error}
        </Text>
      </Box>
    );
  }

  if (submissions.length === 0) {
    return (
      <Box>
        <Text size="sm" c="dimmed">
          No applications yet
        </Text>
      </Box>
    );
  }

  return (
    <Stack gap="sm">
      {submissions.map((submission) => (
        <Paper
          key={submission.id}
          p="sm"
          withBorder
          style={{ cursor: 'pointer' }}
          onClick={() => handleJobClick(submission.job_id)}
        >
          <Stack gap="xs">
            <Anchor
              size="sm"
              fw={600}
              onClick={(e) => {
                e.stopPropagation();
                handleJobClick(submission.job_id);
              }}
              style={{ textDecoration: 'none' }}
            >
              {submission.job_title}
            </Anchor>
            <Badge
              color={STATUS_COLORS[submission.status] || 'gray'}
              size="sm"
              variant="light"
            >
              {submission.status.charAt(0).toUpperCase() + submission.status.slice(1)}
            </Badge>
            <Text size="xs" c="dimmed">
              {formatDate(submission.submitted_at)}
            </Text>
          </Stack>
        </Paper>
      ))}
    </Stack>
  );
}
