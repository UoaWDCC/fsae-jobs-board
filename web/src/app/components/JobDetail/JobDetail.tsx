import { useMemo, useState } from 'react';
import { Text, Button, Badge } from '@mantine/core';
import { jwtDecode } from 'jwt-decode';
import styles from './JobDetail.module.css';
import { adminApi } from '@/api/admin';
import { useNavigate } from 'react-router-dom';
import DeletePostModal from '../Modal/DeletePostModal';

interface JwtPayload {
  role?: string;
}

interface JobDetailProps {
  job: {
    id: string;
    title: string;
    description: string;
    salary: string;
    startDate: string;
    applicationDeadline: string;
    duration: string;
    location: string;
    skills?: string[];
    qualifications?: string[];
  };
}

export function JobDetail({ job }: JobDetailProps) {
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

  return (
    <>
      <main className={styles.jobDetailPageWrapper}>
        <div className={styles.contentWrapper}>
          {/* left column */}
          <div className={styles.leftColumn}>
            <img src="/WDCCLogo.png" alt="Company Logo" className={styles.companyLogo} />

            <Text size="xl" fw={700} className={styles.detailItem}>
              Salary: <span style={{ fontWeight: 400 }}>{job.salary}</span>
            </Text>
            <Text size="xl" fw={700} className={styles.detailItem}>
              Start Date:{' '}
              <span
                style={{ fontWeight: 400 }}
              >{`TODO: add start date to Job model or remove this`}</span>
            </Text>
            <Text size="xl" fw={700} className={styles.detailItem}>
              Duration:{' '}
              <span
                style={{ fontWeight: 400 }}
              >{`TODO: add start date to Job model or remove this`}</span>
            </Text>
            <Text size="xl" fw={700} className={styles.detailItem}>
              Application Deadline:{' '}
              <span style={{ fontWeight: 400 }}>{job.applicationDeadline}</span>
            </Text>

            <Text size="1.4rem" fw={700}>
              Relevant Skills for this Job:
            </Text>
            <ul className={styles.skillList}>
              {job.skills?.map((skill) => (
                <li key={skill}>{skill}</li>
              ))}
            </ul>
          </div>

          {/* right column */}
          <div className={styles.rightColumn}>
            <div className={styles.titleRow}>
              <Text size="2.25rem" fw={700}>
                {job.title}
              </Text>
              <Badge size="xl" color="blue" className={styles.jobBadge}>
                WDCC
              </Badge>
            </div>

            <Text>{job.location} 📍</Text>

            <div className={styles.buttonRow}>
              {role === 'admin' ? (
                <Button color="red" onClick={() => setModalOpen(true)} radius="xl">
                  Delete Post
                </Button>
              ) : (
                <>
                  <Button>Apply ↗</Button>
                  <Button variant="outline">Save</Button>
                </>
              )}
            </div>

            <Text size="2rem" fw={700}>
              About
            </Text>
            <Text>{job.description}</Text>

            <Text size="2rem" fw={700}>
              Qualifications:
            </Text>
            <ul className={styles.qualifications}>
              {job.qualifications?.map((q, i) => (
                <li key={i}>{q}</li>
              ))}
            </ul>
          </div>
        </div>
      </main>

      <DeletePostModal
        opened={modalOpen}
        onClose={() => setModalOpen(false)}
        onDelete={(reason: string) => {
          setModalOpen(false);
          handleConfirmDelete(reason);
        }}
      />
    </>
  );
}
