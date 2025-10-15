import { useEffect, useState, useMemo } from 'react';
import { Accordion, Text, Loader, Alert, Group, Badge, Select, Button, Box } from '@mantine/core';
import { IconAlertCircle, IconEye } from '@tabler/icons-react';
import { SubmissionDetailModal } from './SubmissionDetailModal';
import { getFormSubmissions, updateSubmissionStatus } from '@/api/tally';
import { toast } from 'react-toastify';
import styles from './SubmissionsSection.module.css';

interface SubmissionsSectionProps {
  jobId: string;
  formId: string | null;
}

interface FormSubmission {
  id: string;
  applicant_name?: string;
  applicant_email?: string;
  submitted_at: string;
  status: string;
  submission_data?: any;
}

const STATUS_COLORS: Record<string, string> = {
  unread: 'blue',
  reviewed: 'gray',
  shortlisted: 'green',
  rejected: 'red',
};

const STATUS_OPTIONS = [
  { value: 'unread', label: 'Unread' },
  { value: 'reviewed', label: 'Reviewed' },
  { value: 'shortlisted', label: 'Shortlisted' },
  { value: 'rejected', label: 'Rejected' },
];

export function SubmissionsSection({ jobId, formId }: SubmissionsSectionProps) {
  const [submissions, setSubmissions] = useState<FormSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSubmission, setSelectedSubmission] = useState<FormSubmission | null>(null);
  const [modalOpened, setModalOpened] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    const fetchSubmissions = async () => {
      if (!formId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        // Fetch all submissions (no filter) for accurate counts
        const response = await getFormSubmissions(formId);
        setSubmissions(response.submissions || []);
      } catch (err: any) {
        console.error('Error fetching submissions:', err);
        setError(err.message || 'Failed to load submissions');
      } finally {
        setLoading(false);
      }
    };

    fetchSubmissions();
  }, [formId]);

  const handleStatusChange = async (submissionId: string, newStatus: string) => {
    try {
      await updateSubmissionStatus(submissionId, newStatus);

      // Update local state optimistically
      setSubmissions((prev) =>
        prev.map((sub) =>
          sub.id === submissionId ? { ...sub, status: newStatus } : sub
        )
      );

      // Update selected submission if it's the one being changed
      if (selectedSubmission && selectedSubmission.id === submissionId) {
        setSelectedSubmission({ ...selectedSubmission, status: newStatus });
      }

      toast.success('Submission status updated');
    } catch (err: any) {
      console.error('Error updating submission status:', err);
      toast.error(err.message || 'Failed to update status');
    }
  };

  const handleViewDetails = (submission: FormSubmission) => {
    setSelectedSubmission(submission);
    setModalOpened(true);
  };

  const handleCloseModal = () => {
    setModalOpened(false);
    setSelectedSubmission(null);
  };

  // Filter submissions client-side based on status filter
  const filteredSubmissions = useMemo(() => {
    if (statusFilter === 'all') return submissions;
    return submissions.filter(sub => sub.status === statusFilter);
  }, [submissions, statusFilter]);

  // Calculate status counts from ALL submissions (not filtered)
  const statusCounts = useMemo(() => {
    return submissions.reduce((acc, sub) => {
      acc[sub.status] = (acc[sub.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  }, [submissions]);

  if (!formId) {
    return null;
  }

  if (loading) {
    return (
      <div className={styles.submissionsContainer}>
        <Text size="xl" fw={700} mb="md">
          Applications
        </Text>
        <Loader />
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.submissionsContainer}>
        <Text size="xl" fw={700} mb="md">
          Applications
        </Text>
        <Alert icon={<IconAlertCircle size={16} />} title="Error" color="red">
          {error}
        </Alert>
      </div>
    );
  }

  if (submissions.length === 0) {
    return (
      <div className={styles.submissionsContainer}>
        <Text size="xl" fw={700} mb="md">
          Applications
        </Text>
        <Text c="dimmed">No applications yet</Text>
      </div>
    );
  }

  return (
    <div className={styles.submissionsContainer}>
      {/* Header with Status Filter */}
      <Group justify="space-between" mb="lg" align="flex-start">
        <div>
          <Text size="xl" fw={700} mb={4}>
            Applications ({submissions.length})
          </Text>
          <Text size="sm" c="dimmed">
            {statusCounts.unread || 0} unread, {statusCounts.reviewed || 0} reviewed, {statusCounts.shortlisted || 0} shortlisted, {statusCounts.rejected || 0} rejected
          </Text>
        </div>
        <Select
          data={[
            { value: 'all', label: 'All Status' },
            ...STATUS_OPTIONS,
          ]}
          value={statusFilter}
          onChange={(val) => val && setStatusFilter(val)}
          w={150}
        />
      </Group>

      {/* Accordion List */}
      <Accordion
        variant="separated"
        chevronPosition="right"
        styles={{
          item: { backgroundColor: '#25262b', border: '1px solid #373a40', marginBottom: '0.5rem' },
          control: {
            padding: '1rem',
            '&:hover': { backgroundColor: '#2c2e33' },
          },
          panel: { padding: '1rem', paddingTop: '0.5rem' },
          content: { paddingTop: 0 },
        }}
      >
        {filteredSubmissions.map((submission) => (
          <Accordion.Item key={submission.id} value={submission.id}>
            {/* COLLAPSED VIEW - Compact Summary */}
            <Accordion.Control>
              <Group justify="space-between" wrap="nowrap" style={{ width: '100%', paddingRight: '1rem' }}>
                <Box style={{ flex: 1, minWidth: 0 }}>
                  <Group gap="xs" mb={4}>
                    <Text fw={600} size="md" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {submission.applicant_name || 'Unknown Applicant'}
                    </Text>
                    <Badge color={STATUS_COLORS[submission.status] || 'gray'} size="sm" variant="filled">
                      {submission.status}
                    </Badge>
                  </Group>
                  <Text size="sm" c="dimmed" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {submission.applicant_email || 'No email provided'}
                  </Text>
                </Box>
                <Text size="sm" c="dimmed" style={{ flexShrink: 0 }}>
                  {new Date(submission.submitted_at).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </Text>
              </Group>
            </Accordion.Control>

            {/* EXPANDED VIEW - Quick Actions */}
            <Accordion.Panel>
              <Group justify="space-between" pt="sm" style={{ borderTop: '1px solid #373a40' }}>
                <Group gap="sm">
                  <Text size="sm" fw={500}>
                    Status:
                  </Text>
                  <Select
                    data={STATUS_OPTIONS}
                    value={submission.status}
                    onChange={(val) => val && handleStatusChange(submission.id, val)}
                    w={140}
                    size="sm"
                  />
                </Group>
                <Button
                  variant="light"
                  size="sm"
                  leftSection={<IconEye size={16} />}
                  onClick={() => handleViewDetails(submission)}
                >
                  View Details
                </Button>
              </Group>
            </Accordion.Panel>
          </Accordion.Item>
        ))}
      </Accordion>

      {/* Submission Detail Modal */}
      {selectedSubmission && (
        <SubmissionDetailModal
          opened={modalOpened}
          onClose={handleCloseModal}
          submission={selectedSubmission}
          onStatusChange={handleStatusChange}
        />
      )}
    </div>
  );
}
