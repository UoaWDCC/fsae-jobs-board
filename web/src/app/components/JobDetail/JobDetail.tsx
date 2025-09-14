import { useMemo, useState } from 'react';
import { Text, Button, Badge } from '@mantine/core';
import styles from './JobDetail.module.css';
import { Job } from '@/models/job.model';
import { JobDetailEditor } from './JobDetailEditor';
import { adminApi } from '@/api/admin';
import { useNavigate } from 'react-router-dom';
import DeletePostModal from '../Modal/DeletePostModal';
import { jwtDecode } from 'jwt-decode';

interface JwtPayload {
  role?: string;
}

interface JobDetailProps {
  job: Job;
}

export function JobDetail({ job }: JobDetailProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const navigate = useNavigate();

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

  const handleConfirmDelete = async (reason: string) => {
    await adminApi.deleteJob(job.id, reason); // optionally pass reason to backend
    console.log('Deleted with reason:', reason);
    navigate('/jobs');
  };

  if (isEditing) {
    return <JobDetailEditor />;
  }

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

          {/* Skills section - commented out as skills property doesn't exist in Job model */}
          {/* {job.skills && job.skills.length > 0 && (
            <div>
              <Text size="1.4rem" fw={700}>Relevant Skills for this Job: </Text>
              <ul className={styles.skillList}>
                {job.skills.map((skill: string) => (
                  <li key={skill}>{skill}</li>
                ))}
              </ul>
            </div>
          )} */}
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
              <Button color="red" onClick={() => setModalOpen(true)} radius="xl">
                Delete Post
              </Button>
            ) : (
              <>
                <Button>Apply ↗</Button>
                <Button variant="outline">Save</Button>
                <Button variant="light" onClick={() => setIsEditing(true)}>Edit Job</Button>
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
      <DeletePostModal
        opened={modalOpen}
        onClose={() => setModalOpen(false)}
        onDelete={(reason: string) => {
          setModalOpen(false);
          handleConfirmDelete(reason);
        }}
      />
    </main>
  );
}
