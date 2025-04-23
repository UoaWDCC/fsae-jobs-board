import { Text, Button, Badge } from '@mantine/core';
import styles from './JobDetail.module.css';
import { Job } from '@/models/job.model';

// TODO :
// Needs rework to use Mantine components and look a better, also need to match the FSAE design system

export function JobDetail({ job }: { job: Job }) {
  return (
    <main className={styles.jobDetailPageWrapper}>
      <div className={styles.contentWrapper}>
        {/* Left Column */}
        <div className={styles.leftColumn}>
          <div>
            <Text size="sm"><strong>Salary:</strong> {job.salary}</Text>
            <Text size="sm"><strong>Dead line:</strong> {job.applicationDeadline}</Text>
          </div>

          <div>
            <Text className={styles.sectionTitle}><strong>Specialisation and Skills:</strong> {job.specialisation}</Text>
            {
            /*
            Skills are currently not being used in the Job model, but can be added later.
            <ul className={styles.skillList}>
              {job.skills?.map((skill) => (
                <li key={skill}>{skill}</li>
              ))}
            </ul> */}
          </div>
        </div>

        {/* Right Column */}
        <div className={styles.rightColumn}>
          <div className={styles.titleRow}>
            <Text size="xl" fw={700}>{job.title}</Text>
            <Badge color="blue">WDCC</Badge>
          </div>

          <div className={styles.buttonRow}>
            <Button
              component="a"
              href={job.applicationLink}
              target="_blank"
              rel="noopener noreferrer"
              variant="filled">
              Apply ↗
            </Button>
            <Button variant="outline">Save</Button>
          </div>

          <Text className={styles.sectionTitle}>About</Text>
          <Text size="sm">
            {job.description}
            <br />
            Posted on: {job.datePosted}
          </Text>
          {/* 
          Qualifications are currently not being used in the Job model, but can be added later.
          <Text className={styles.sectionTitle}>Qualifications:</Text>
          <ul className={styles.qualifications}>
            {job.qualifications?.map((q, index) => (
              <li key={index}>{q}</li>
            ))}
          </ul> */}

          <Text size="sm" mt="md">
            If you are passionate about software development and eager to kick-start your career in a dynamic and innovative environment, we encourage you to apply for this exciting opportunity. Join us and be part of a team that's shaping the future of technology. Apply now!
          </Text>
        </div>
      </div>
    </main>
  );
}
