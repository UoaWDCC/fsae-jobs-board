import { useEffect, useMemo, useState } from 'react';
import { Text, Button, Badge, Avatar, Loader, Modal } from '@mantine/core';
import { IconInfoCircle } from '@tabler/icons-react';
import styles from './JobDetail.module.css';
import { Job } from '@/models/job.model';
import { adminApi } from '@/api/admin';
import { useNavigate } from 'react-router-dom';
import DeletePostModal from '../Modal/DeletePostModal';
import { jwtDecode } from 'jwt-decode';
import { useSelector } from 'react-redux';
import { RootState } from '../../../app/store';
import { getJobApplicationForm, TallyApplicationFormResponse, getJobFormPreview, FormPreviewResponse } from '@/api/tally';
import { useUserAvatar } from '@/hooks/useUserAvatar';
import { SubmissionsSection } from '../SubmissionsSection';

interface JwtPayload {
  role?: string;
}

interface JobDetailProps {
  job: Job;
}

export function JobDetail({ job }: JobDetailProps) {
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [applyModalOpen, setApplyModalOpen] = useState(false);
  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  const [tallyFormData, setTallyFormData] = useState<TallyApplicationFormResponse | null>(null);
  const [previewFormData, setPreviewFormData] = useState<FormPreviewResponse | null>(null);
  const [loadingForm, setLoadingForm] = useState(false);
  const [loadingPreview, setLoadingPreview] = useState(false);
  const [publisherRole, setPublisherRole] = useState<string>('');
  const navigate = useNavigate();

  const { avatarUrl: posterAvatar } = useUserAvatar(job?.publisherID);

  const userRole = useSelector((state: RootState) => state.user.role);
  const userId = useSelector((state: RootState) => state.user.id);

  const fetchPublisherRole = async (publisherId: string) => {
    if (!publisherId) {
      return;
    }

    try {
      const token = localStorage.getItem('accessToken');
      
      // Try sponsor endpoint first
      let response = await fetch(`http://localhost:3000/user/sponsor/${publisherId}`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (response.ok) {
        setPublisherRole('sponsor');
        return;
      }

      // If sponsor not found, try alumni endpoint
      response = await fetch(`http://localhost:3000/user/alumni/${publisherId}`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (response.ok) {
        setPublisherRole('alumni');
        return;
      }

      setPublisherRole('');
    } catch (error) {
      console.error('Error fetching publisher role:', error);
      setPublisherRole('');
    }
  }

  useEffect(() => {
    if (job?.publisherID) {
      fetchPublisherRole(job.publisherID);
    }
  }, [job?.publisherID]);

  // Click handler for avatar
  const handleAvatarClick = () => {
    if (!job?.publisherID || !publisherRole) {
      return;
    }
    
    if (publisherRole === 'sponsor') {
      navigate(`/profile/sponsor/${job.publisherID}`);
    } else if (publisherRole === 'alumni') {
      navigate(`/profile/alumni/${job.publisherID}`);
    }
  };

  const role = useMemo(() => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) return null;
      const payload = jwtDecode<JwtPayload>(token);
      return payload.role ?? null;
    } catch {
      return null;
    }
  }, []);

  // Check if user can edit this job
  const canEdit = userRole === 'sponsor' || userRole === 'alumni';
  const canApply = userRole === 'alumni' || userRole === 'member';
  const isOwner = userId && job.publisherID === userId;

  // Fetch Tally form if user can apply
  useEffect(() => {
    if (canApply && job.id) {
      setLoadingForm(true);
      getJobApplicationForm(job.id)
        .then((data) => {
          setTallyFormData(data);
        })
        .catch((error) => {
          console.error('Error fetching application form:', error);
          setTallyFormData(null);
        })
        .finally(() => {
          setLoadingForm(false);
        });
    }
  }, [canApply, job.id]);

  const handleConfirmDelete = async (reason: string) => {
    await adminApi.deleteJob(job.id, reason); // optionally pass reason to backend
    console.log('Deleted with reason:', reason);
    navigate('/jobs');
  };

  const handleEditJob = () => {
    if (!canEdit) {
      console.error('User does not have permission to edit jobs');
      return;
    }

    if (!isOwner) {
      console.error('User can only edit their own job posts');
      return;
    }

    navigate(`/job-editor/${job.id}`);
  };

  const handleApplyClick = () => {
    // If job has Tally form, open modal
    if (job.tallyFormId && tallyFormData?.has_form) {
      setApplyModalOpen(true);
    }
    // If job has external link, redirect
    else if (job.applicationLink) {
      window.open(job.applicationLink, '_blank', 'noopener,noreferrer');
    }
    // Fallback: no application method available
    else {
      console.error('No application method available for this job');
    }
  };

  const handlePreviewClick = async () => {
    if (!job.id) return;

    setLoadingPreview(true);
    try {
      const previewData = await getJobFormPreview(job.id);
      setPreviewFormData(previewData);
      setPreviewModalOpen(true);
    } catch (error) {
      console.error('Error fetching form preview:', error);
    } finally {
      setLoadingPreview(false);
    }
  };

  return (
    <main className={styles.jobDetailPageWrapper}>
      <div className={styles.contentWrapper}>
        {/* Left Column */}
        <div className={styles.leftColumn}>
          <Avatar
            src={posterAvatar}
            alt={"Company Logo"}
            onClick={handleAvatarClick}
            className={styles.companyLogo}
            style={{ cursor: publisherRole ? 'pointer' : 'default' }}
          />
          <div>
            <Text size="xl" fw={700} className={styles.detailItem}>
              Salary: <span style={{ fontWeight: 400 }}>{job.salary}</span>
            </Text>
            <Text size="xl" fw={700} className={styles.detailItem}>
              Application Deadline:{' '}
              <span style={{ fontWeight: 400 }}>{job.applicationDeadline}</span>
            </Text>
          </div>
        </div>

        {/* Right Column */}
        <div className={styles.rightColumn}>
          <div className={styles.titleRow}>
            <Text size="2.25rem" fw={700}>{job.title}</Text>
            <Badge size="xl" color="blue" className={styles.jobBadge}>WDCC</Badge>
          </div>

          <div className={styles.buttonRow}>
            {role === 'admin' ? (
              <Button color="red" onClick={() => setDeleteModalOpen(true)} radius="xl">
                Delete Post
              </Button>
            ) : (
              <>
                {canApply && !isOwner && (
                  <>
                    {/* Apply Button - Opens modal for Tally form or redirects to external link */}
                    {!loadingForm && !tallyFormData?.already_applied && (
                      <Button
                        onClick={handleApplyClick}
                        disabled={loadingForm}
                      >
                        {job.tallyFormId ? 'Apply' : 'Apply ↗'}
                      </Button>
                    )}

                    {/* Already Applied - Disabled button */}
                    {!loadingForm && tallyFormData?.already_applied && (
                      <Button
                        disabled
                        c="green"
                      >
                        ✓ Already Applied
                      </Button>
                    )}

                    {/* Save button */}
                    <Button variant="outline">Save</Button>
                  </>
                )}
                {canEdit && isOwner && (
                  <>
                    <Button variant="light" onClick={handleEditJob}>
                      Edit Job
                    </Button>
                    {job.tallyFormId && (
                      <Button
                        variant="outline"
                        onClick={handlePreviewClick}
                        loading={loadingPreview}
                      >
                        Preview Form
                      </Button>
                    )}
                  </>
                )}
              </>
            )}
          </div>

          <Text size="2rem" fw={700}>
            About
          </Text>
          <Text>{job.description}</Text>

          {/* Submissions Section for Job Owners */}
          {isOwner && job.tallyFormId && (
            <div style={{ marginTop: '3rem' }}>
              <SubmissionsSection jobId={job.id} formId={job.tallyFormId} />
            </div>
          )}
        </div>
      </div>

      {/* Application Modal */}
      <Modal
        opened={applyModalOpen}
        onClose={() => setApplyModalOpen(false)}
        title="Apply for this Position"
        size="xl"
        centered
        styles={{
          body: {
            minHeight: '600px',
            backgroundColor: 'white',
          },
          content: {
            borderRadius: '12px',
            border: '1px solid #228be6',
          },
          header: {
            backgroundColor: 'white',
            borderBottom: '1px solid #e9ecef',
          },
          title: {
            color: '#212529',
            fontSize: '1.25rem',
            fontWeight: 600,
          },
        }}
      >
        {loadingForm && (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}>
            <Loader color="blue" size="lg" />
          </div>
        )}

        {!loadingForm && tallyFormData?.already_applied && (
          <div style={{ padding: '2rem', textAlign: 'center' }}>
            <Text c="green" size="lg" fw={600}>
              ✓ You have already applied for this position
            </Text>
            <Text c="dimmed" mt="sm">
              Application submitted on{' '}
              {tallyFormData.submission_date
                ? new Date(tallyFormData.submission_date).toLocaleDateString()
                : 'a previous date'}
            </Text>
          </div>
        )}

        {!loadingForm && tallyFormData?.has_form && !tallyFormData.already_applied && tallyFormData.embed_url && (
          <iframe
            src={tallyFormData.embed_url}
            width="100%"
            height="650"
            frameBorder="0"
            marginHeight={0}
            marginWidth={0}
            title="Application Form"
            style={{ border: 'none' }}
          />
        )}

        {!loadingForm && !tallyFormData?.has_form && (
          <div style={{ padding: '2rem', textAlign: 'center' }}>
            <Text c="dimmed">
              No application form available. Please contact the employer directly.
            </Text>
          </div>
        )}
      </Modal>

      {/* Preview Modal (for job creators) */}
      <Modal
        opened={previewModalOpen}
        onClose={() => setPreviewModalOpen(false)}
        title="Preview Application Form"
        size="xl"
        centered
        styles={{
          body: {
            minHeight: '600px',
            backgroundColor: 'white',
          },
          content: {
            borderRadius: '12px',
            border: '1px solid #228be6',
          },
          header: {
            backgroundColor: 'white',
            borderBottom: '1px solid #e9ecef',
          },
          title: {
            color: '#212529',
            fontSize: '1.25rem',
            fontWeight: 600,
          },
        }}
      >
        {/* Compact Preview Banner */}
        <div style={{
          padding: '8px 16px',
          backgroundColor: '#d0ebff',
          borderRadius: '4px',
          marginBottom: '12px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <IconInfoCircle size={16} color="#1864ab" />
          <Text size="sm" c="#1864ab" fw={500}>
            Preview mode - submissions will not be recorded
          </Text>
        </div>

        {loadingPreview && (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}>
            <Loader color="blue" size="lg" />
          </div>
        )}

        {!loadingPreview && previewFormData?.preview_embed_url && (
          <iframe
            src={previewFormData.preview_embed_url}
            width="100%"
            height="600"
            frameBorder="0"
            marginHeight={0}
            marginWidth={0}
            title="Application Form Preview"
            style={{ border: 'none' }}
          />
        )}
      </Modal>

      <DeletePostModal
        opened={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onDelete={(reason: string) => {
          setDeleteModalOpen(false);
          handleConfirmDelete(reason);
        }}
      />
    </main>
  );
}
