import { useMemo, useState } from 'react';
import { Text, Button, Badge } from '@mantine/core';
import styles from './JobDetail.module.css';
import { Job } from '@/models/job.model';
import { adminApi } from '@/api/admin';
import { useNavigate } from 'react-router-dom';
import DeletePostModal from '../Modal/DeletePostModal';
import { JobEditorModal } from '../Modal/EditJob';
import { jwtDecode } from 'jwt-decode';
import { useSelector } from 'react-redux';
import { RootState } from '../../../app/store';

interface JwtPayload {
  role?: string;
}

interface JobDetailProps {
  job: Job;
}

export function JobDetail({ job }: JobDetailProps) {
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const navigate = useNavigate();

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
    
    setEditModalOpen(true);
  };

  const handleJobEditSuccess = () => {
    setEditModalOpen(false);
    // Optionally refresh the page or update the job data
    window.location.reload();
  };

  return (
    <main className={styles.jobDetailPageWrapper}>
      <div className={styles.contentWrapper}>
        {/* Left Column */}
        <div className={styles.leftColumn}>
          <img src="/WDCCLogo.png" alt="Company Logo" className={styles.companyLogo} />
          <div>
            <Text size="xl" fw={700} className={styles.detailItem}>
              Salary: <span style={{ fontWeight: 400 }}>{job.salary}</span>
            </Text>
            <Text size="xl" fw={700} className={styles.detailItem}>
              Start Date:{' '}
              <span style={{ fontWeight: 400 }}>{job.startDate || 'TBD'}</span>
            </Text>
            <Text size="xl" fw={700} className={styles.detailItem}>
              Duration:{' '}
              <span style={{ fontWeight: 400 }}>{job.duration || 'TBD'}</span>
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

          <Text>
            {job.location ? job.location : 'Location not specified'} 📍
          </Text>

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

          {/* Qualifications section - commented out as qualifications property doesn't exist in Job model */}
          {/* {job.qualifications && job.qualifications.length > 0 && (
            <>
              <Text size="2rem" fw={700}>Qualifications:</Text>
              <ul className={styles.qualifications}>
                {job.qualifications.map((q: string, index: number) => (
                  <li key={index}>{q}</li>
                ))}
              </ul>
            </>
          )} */}
        </div>
      </div>
      
      <JobEditorModal
        opened={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        onSuccess={handleJobEditSuccess}
        initialData={job}
        mode="edit"
      />
      
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
