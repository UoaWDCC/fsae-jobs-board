import { TextInput, Textarea, Button, Badge, MultiSelect } from '@mantine/core';
import styles from './JobDetail.module.css';

// same layout as the JobDetail component
export function JobDetailEditor() {
  return (
    <main className={styles.jobDetailPageWrapper}>
      <form className={styles.contentWrapper}>
        {/* Left Column */}
        <div className={styles.leftColumn}>
          <img src="/WDCCLogo.png" alt="Company Logo" className={styles.companyLogo} />
          <div className={styles.leftFields}>
            <TextInput label="Salary" placeholder="Enter salary" className={styles.detailItem} />
            <TextInput label="Start Date" placeholder="Enter start date" className={styles.detailItem} />
            <TextInput label="Duration" placeholder="Enter duration" className={styles.detailItem} />
            <TextInput label="Application Deadline" placeholder="Enter application deadline" className={styles.detailItem} />
          </div>

          <MultiSelect
            label="Relevant Skills for this Job"
            placeholder="Add skills"
            data={[]}
            className={styles.skillList}
          />
        </div>

        {/* Right Column */}
        <div className={styles.rightColumn}>
          <div className={styles.titleRow}>
            <TextInput label="Job Title" placeholder="Job Title" className={styles.titleInput} />
            <div className={styles.badgeField}>
              <label className={styles.badgeLabel}>Organisation</label>
              <Badge size="xl" color="blue" className={styles.jobBadge}>WDCC</Badge>
            </div>
          </div>

          <TextInput label="Location" placeholder="Location" className={styles.fullWidth} />

          <div className={styles.buttonRow}>
            <Button type="submit">Save</Button>
            <Button variant="outline" type="button">Cancel</Button>
          </div>

          <Textarea label="About" placeholder="Type job description here" minRows={4} className={styles.fullWidth} />

          <Textarea
            label="Qualifications"
            placeholder="List qualifications here (one per line)"
            minRows={3}
            className={`${styles.fullWidth} ${styles.qualifications}`}
          />

        </div>
      </form>
    </main>
  );
}
