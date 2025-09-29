import { useMemo, useState } from 'react';
import { Text, Button, Badge } from '@mantine/core';
import styles from './JobDetail.module.css';
import { Job } from '@/models/job.model';
import { adminApi } from '@/api/admin';
import { useNavigate } from 'react-router-dom';
import DeletePostModal from '../Modal/DeletePostModal';
import { jwtDecode } from 'jwt-decode';
import { useSelector } from 'react-redux';
import { RootState } from '../../../app/store';
import { useMediaQuery } from '@mantine/hooks';

interface JwtPayload { role?: string; }
interface JobDetailProps { job: Job; }

function fmtLongDate(value?: string | null) {
  if (!value) return '—';
  const d = new Date(value);
  if (isNaN(d.getTime())) return '—';
  return new Intl.DateTimeFormat('en-NZ', { day: 'numeric', month: 'long', year: 'numeric' }).format(d);
}

// renders label/value only when value exists as per ben's feedback with possibly new fields to model.
function DetailRow({ label, value }: { label: string; value?: string | null }) {
  if (!value) return null;
  return (
    <Text className={styles.detailRow}>
      <strong className={styles.detailLabel}>{label}:</strong>
      <span className={styles.detailValue}>{value}</span>
    </Text>
  );
}

export function JobDetail({ job }: JobDetailProps) {
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const navigate = useNavigate();
  const isMobile = useMediaQuery('(max-width: 768px)');

  const userRole = useSelector((state: RootState) => state.user.role);
  const userId = useSelector((state: RootState) => state.user.id);

  const role = useMemo(() => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) return null;
      const payload = jwtDecode<JwtPayload>(token);
      return payload.role ?? null;
    } catch { return null; }
  }, []);

  const canEdit = userRole === 'sponsor' || userRole === 'alumni';
  const canApply = userRole === 'alumni' || userRole === 'member';
  const isOwner = userId && job.publisherID === userId;

  const handleConfirmDelete = async (reason: string) => {
    await adminApi.deleteJob(job.id, reason);
    navigate('/jobs');
  };

  const handleEditJob = () => {
    if (!canEdit || !isOwner) return;
    navigate(`/job-editor/${job.id}`);
  };

  return (
    <main className={styles.jobDetailPageWrapper}>
      {!isMobile ? (
        <div className={styles.contentWrapper}>
          <div className={styles.leftColumn}>
            <img src="/WDCCLogo.png" alt="Company Logo" className={styles.companyLogo} />
            <DetailRow label="Salary" value={job.salary ?? '—'} />
            <DetailRow label="Application Deadline" value={fmtLongDate(job.applicationDeadline)} />
          </div>

          <div className={styles.rightColumn}>
            <div className={styles.titleRow}>
              <Text size="2.25rem" fw={700} className={styles.jobTitle}>
                {job.title}
              </Text>
              <Badge size="xl" color="blue" className={styles.jobBadge}>WDCC</Badge>
            </div>

            <div className={styles.buttonRow}>
              {role === 'admin' ? (
                <Button color="red" onClick={() => setDeleteModalOpen(true)} radius="xl">
                  Delete Post
                </Button>
              ) : (
                <>
                  {canApply && (
                    <Button
                      component="a"
                      href={job.applicationLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.applyButton}
                    >
                      Apply ↗
                    </Button>
                  )}
                  {canEdit && isOwner && (
                    <Button variant="light" onClick={handleEditJob}>
                      Edit Job
                    </Button>
                  )}
                </>
              )}
            </div>

            <Text size="2rem" fw={700} className={styles.aboutHeading}>
              About
            </Text>
            <Text>{job.description}</Text>
          </div>
        </div>
      ) : (
        <div className={styles.mobileWrapper}>
          <img src="/WDCCLogo.png" alt="Company Logo" className={styles.mobileLogo} />
          <Text fw={700} className={styles.mobileTitle}>{job.title}</Text>

          <div className={styles.mobileDetails}>
            <DetailRow label="Location" value={job.location ?? '—'} />
            <DetailRow label="Salary" value={job.salary ?? undefined} />
            <DetailRow label="Application Deadline" value={fmtLongDate(job.applicationDeadline)} />
            <DetailRow label="Start Date" value={job.startDate ? fmtLongDate(job.startDate) : undefined} />
            <DetailRow label="Duration" value={job.duration ?? undefined} />
            <DetailRow label="Specialisation" value={job.specialisation ?? undefined} />
            <DetailRow label="Role Type" value={job.roleType ?? undefined} />
            <DetailRow label="Date Posted" value={job.datePosted ? fmtLongDate(job.datePosted) : undefined} />
          </div>

          <Text fw={700} className={styles.mobileSectionTitle}>About</Text>
          <Text className={styles.mobileBody}>{job.description}</Text>

          <div className={styles.mobileButtonRow}>
            {role === 'admin' ? (
              <Button color="red" onClick={() => setDeleteModalOpen(true)} radius="xl">
                Delete Post
              </Button>
            ) : (
              <>
                {canApply && (
                  <Button fullWidth className={styles.applyButton}>
                    Apply ↗
                  </Button>
                )}
                {canEdit && isOwner && (
                  <Button variant="light" fullWidth onClick={handleEditJob}>
                    Edit Job
                  </Button>
                )}
              </>
            )}
          </div>
        </div>
      )}

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
