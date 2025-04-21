import { Text, Button, Badge } from '@mantine/core';
import styles from './JobDetail.module.css';

interface JobDetailProps {
  job: {
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
  return (
    <main className={styles.jobDetailPageWrapper}>
      <div className={styles.contentWrapper}>
        {/* Left Column */}
        <div className={styles.leftColumn}>
          <div>
            <Text size="sm"><strong>Salary:</strong> {job.salary}</Text>
            <Text size="sm"><strong>Start Date:</strong> {job.startDate}</Text>
            <Text size="sm"><strong>Duration:</strong> {job.duration}</Text>
            <Text size="sm"><strong>Application Deadline:</strong> {job.applicationDeadline}</Text>
          </div>

          <div>
            <Text className={styles.sectionTitle}>Relevant Skills for this Job</Text>
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
            <Text size="xl" fw={700}>{job.title}</Text>
            <Badge color="blue">WDCC</Badge>
          </div>

          <Text size="sm" color="dimmed">{job.location} 📍</Text>

          <div className={styles.buttonRow}>
            <Button>Apply ↗</Button>
            <Button variant="outline">Save</Button>
          </div>

          <Text className={styles.sectionTitle}>About</Text>
          <Text size="sm">
            {job.description}
          </Text>

          <Text className={styles.sectionTitle}>Qualifications:</Text>
          <ul className={styles.qualifications}>
            {job.qualifications?.map((q, index) => (
              <li key={index}>{q}</li>
            ))}
          </ul>

          <Text size="sm" mt="md">
            If you are passionate about software development and eager to kick-start your career in a dynamic and innovative environment, we encourage you to apply for this exciting opportunity. Join us and be part of a team that's shaping the future of technology. Apply now!
          </Text>
        </div>
      </div>
    </main>
  );
}
