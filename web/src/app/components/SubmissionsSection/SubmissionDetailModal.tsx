import { Modal, Stack, Text, Group, Badge, Select, Paper, Divider } from '@mantine/core';
import { useState } from 'react';

interface SubmissionDetailModalProps {
  opened: boolean;
  onClose: () => void;
  submission: {
    id: string;
    applicant_name?: string;
    applicant_email?: string;
    submitted_at: string;
    status: string;
    submission_data?: any;
  };
  onStatusChange: (submissionId: string, newStatus: string) => void;
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

export function SubmissionDetailModal({
  opened,
  onClose,
  submission,
  onStatusChange,
}: SubmissionDetailModalProps) {
  const [isUpdating, setIsUpdating] = useState(false);

  const handleStatusChange = async (newStatus: string | null) => {
    if (!newStatus || newStatus === submission.status) return;

    setIsUpdating(true);
    try {
      await onStatusChange(submission.id, newStatus);
    } finally {
      setIsUpdating(false);
    }
  };

  const formattedDate = new Date(submission.submitted_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  // Extract form fields from submission_data
  const formFields = submission.submission_data?.fields || [];

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={
        <Text size="xl" fw={700}>
          Application Details
        </Text>
      }
      size="lg"
      centered
    >
      <Stack gap="md">
        {/* Applicant Information */}
        <Paper p="md" withBorder>
          <Stack gap="xs">
            <Group justify="space-between">
              <div>
                <Text size="lg" fw={600}>
                  {submission.applicant_name || 'Unknown Applicant'}
                </Text>
                <Text size="sm" c="dimmed">
                  {submission.applicant_email || 'No email provided'}
                </Text>
              </div>
              <Badge color={STATUS_COLORS[submission.status] || 'gray'} size="lg" variant="filled">
                {submission.status}
              </Badge>
            </Group>

            <Text size="sm" c="dimmed">
              Submitted: {formattedDate}
            </Text>

            <Group gap="sm" mt="xs">
              <Text size="sm" fw={500}>
                Update Status:
              </Text>
              <Select
                data={STATUS_OPTIONS}
                value={submission.status}
                onChange={handleStatusChange}
                disabled={isUpdating}
                placeholder="Update status"
                style={{ flex: 1, maxWidth: 200 }}
              />
            </Group>
          </Stack>
        </Paper>

        <Divider />

        {/* Form Responses */}
        <div>
          <Text size="lg" fw={600} mb="md">
            Form Responses
          </Text>

          {formFields.length > 0 ? (
            <Stack gap="lg">
              {formFields
                .filter((field: any) => field.type !== 'HIDDEN_FIELDS')
                .map((field: any, index: number) => (
                  <Paper key={index} p="md" withBorder>
                    <Stack gap="xs">
                      <Text size="sm" fw={600} c="dimmed">
                        {field.label || `Question ${index + 1}`}
                      </Text>
                      <Text size="md">
                        {formatFieldValue(field)}
                      </Text>
                    </Stack>
                  </Paper>
                ))}
            </Stack>
          ) : (
            <Text c="dimmed" size="sm">
              No form responses available
            </Text>
          )}
        </div>
      </Stack>
    </Modal>
  );
}

// Helper function to format field values based on type
function formatFieldValue(field: any): string {
  if (!field.value) {
    return 'No answer provided';
  }

  // Handle different field types
  switch (field.type) {
    case 'CHECKBOXES':
    case 'MULTIPLE_CHOICE':
      if (Array.isArray(field.value)) {
        return field.value.join(', ');
      }
      return field.value.toString();

    case 'FILE_UPLOAD':
      if (typeof field.value === 'object' && field.value.url) {
        return `File uploaded: ${field.value.name || 'View file'}`;
      }
      return 'File uploaded';

    default:
      if (Array.isArray(field.value)) {
        return field.value.join(', ');
      }
      return field.value.toString();
  }
}
