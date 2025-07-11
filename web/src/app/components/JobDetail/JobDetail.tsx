import { Text, Button, Badge } from '@mantine/core';
import styles from './JobDetail.module.css';
import { Job } from '@/models/job.model';

interface JobDetailProps {
  job: Job;
}

export function JobDetail({ job }: JobDetailProps) {
  return (
    <main className={styles.jobDetailPageWrapper}>
      <div className={styles.contentWrapper}>
        {/* Left Column */}
        <div className={styles.leftColumn}>
          <img
            src="/WDCCLogo.png"
            alt="Company Logo"
            className={styles.companyLogo}
          />
          <div>
            <Text size="xl" fw={700} className={styles.detailItem}>
              Salary: <span style={{ fontWeight: 400 }}>{job.salary}</span>
            </Text>
            <Text size="xl" fw={700} className={styles.detailItem}>
              Start Date: <span style={{ fontWeight: 400 }}>{job.startDate}</span>
            </Text>
            <Text size="xl" fw={700} className={styles.detailItem}>
              Duration: <span style={{ fontWeight: 400 }}>{job.duration}</span>
            </Text>
            <Text size="xl" fw={700} className={styles.detailItem}>
              Application Deadline: <span style={{ fontWeight: 400 }}>{job.applicationDeadline}</span>
            </Text>
          </div>

          <div>
            <Text size="1.4rem" fw={700}>Relevant Skills for this Job: </Text>
            <ul className={styles.skillList}>
              {job.skills?.map((skill) => (
                <li key={skill}>{skill}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Right Column */}
        <div className={styles.rightColumn}>
          <div className={styles.titleRow}>
            <Text size="2.25rem" fw={700}>{job.title}</Text>
            <Badge size="xl" color="blue" className={styles.jobBadge}>WDCC</Badge>
          </div>

          <Text>{job.location} 📍</Text>

          <div className={styles.buttonRow}>
            <Button>Apply ↗</Button>
            <Button variant="outline">Save</Button>
          </div>

          <Text size="2rem" fw={700}>About</Text>
          <Text>{job.description}</Text>

          <Text size="2rem" fw={700}>Qualifications:</Text>
          <ul className={styles.qualifications}>
            {job.qualifications?.map((q, index) => (
              <li key={index}>{q}</li>
            ))}
          </ul>
        </div>
      </div>
    </main>
  );
}