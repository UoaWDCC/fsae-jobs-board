import { useEffect, useMemo, useState } from 'react';
import { Text, Button, Badge, Avatar } from '@mantine/core';
import styles from './JobDetail.module.css';
import { Job } from '@/models/job.model';
import { adminApi } from '@/api/admin';
import { useNavigate } from 'react-router-dom';
import DeletePostModal from '../Modal/DeletePostModal';
import { jwtDecode } from 'jwt-decode';
import { useSelector } from 'react-redux';
import { RootState } from '../../../app/store';
import { useUserAvatar } from '@/hooks/useUserAvatar';

interface JwtPayload {
  role?: string;
}

interface JobDetailProps {
  job: Job;
}

export function JobDetail({ job }: JobDetailProps) {
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const navigate = useNavigate();

  const { avatarUrl: posterAvatar } = useUserAvatar(job?.publisherID);

  const userRole = useSelector((state: RootState) => state.user.role);
  const userId = useSelector((state: RootState) => state.user.id);

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
          <Avatar src={posterAvatar} alt={"Company Logo"} className={styles.companyLogo} />
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
                {canApply && (<Button>Apply ↗</Button>)}
                {canApply && (<Button variant="outline">Save</Button>)}
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
