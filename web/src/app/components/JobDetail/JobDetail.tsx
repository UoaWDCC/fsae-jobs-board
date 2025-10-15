import { useEffect, useMemo, useState } from 'react';
import { Text, Button, Badge, Avatar, Loader } from '@mantine/core';
import styles from './JobDetail.module.css';
import { Job } from '@/models/job.model';
import { adminApi } from '@/api/admin';
import { useNavigate } from 'react-router-dom';
import DeletePostModal from '../Modal/DeletePostModal';
import { jwtDecode } from 'jwt-decode';
import { useSelector } from 'react-redux';
import { RootState } from '../../../app/store';
import { getJobApplicationForm, TallyApplicationFormResponse } from '@/api/tally';
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
  const [tallyFormData, setTallyFormData] = useState<TallyApplicationFormResponse | null>(null);
  const [loadingForm, setLoadingForm] = useState(false);
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
                {canApply && !isOwner && (<Button>Apply ↗</Button>)}
                {canApply && !isOwner && (<Button variant="outline">Save</Button>)}
                {canEdit && isOwner && (
                  <Button variant="light" onClick={handleEditJob}>
                    Edit Job
                  </Button>
                )}
              </>
            )}
          </div>

          <Text size="2rem" fw={700}>
            About
          </Text>
          <Text>{job.description}</Text>

          {/* Tally Application Form */}
          {canApply && !isOwner && (
            <div style={{ marginTop: '2rem' }}>
              <Text size="2rem" fw={700} mb="md">
                Apply for this Position
              </Text>

              {loadingForm && <Loader />}

              {!loadingForm && tallyFormData?.already_applied && (
                <Text color="green" size="lg">
                  ✓ You have already applied for this position on{' '}
                  {tallyFormData.submission_date
                    ? new Date(tallyFormData.submission_date).toLocaleDateString()
                    : 'a previous date'}
                </Text>
              )}

              {!loadingForm && tallyFormData?.has_form && !tallyFormData.already_applied && tallyFormData.embed_url && (
                <iframe
                  src={tallyFormData.embed_url}
                  width="100%"
                  height="600"
                  frameBorder="0"
                  marginHeight={0}
                  marginWidth={0}
                  title="Application Form"
                  style={{ border: 'none' }}
                />
              )}

              {!loadingForm && !tallyFormData?.has_form && (
                <Text color="dimmed">
                  No application form available. Please use the external application link if provided.
                </Text>
              )}
            </div>
          )}

          {/* Submissions Section for Job Owners */}
          {isOwner && job.tallyFormId && (
            <div style={{ marginTop: '3rem' }}>
              <SubmissionsSection jobId={job.id} formId={job.tallyFormId} />
            </div>
          )}
        </div>
      </div>

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
