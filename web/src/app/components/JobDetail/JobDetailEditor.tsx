import { TextInput, Textarea, Button, Badge, MultiSelect, Select } from '@mantine/core';
import { useState, useEffect } from 'react';
import styles from './JobDetail.module.css';
import { JobCardProps } from '../JobCardCarousel/JobCard';
import { createJob, updateJob } from '@/api/job';
import { toast } from 'react-toastify';

interface JobDetailEditorProps {
  initialData?: JobCardProps;
  onSave?: () => void;
  onCancel?: () => void;
}

// same layout as the JobDetail component
export function JobDetailEditor({ initialData, onSave, onCancel }: JobDetailEditorProps) {
  const [formData, setFormData] = useState({
    title: '',
    specialisation: '',
    description: '',
    roleType: '',
    salary: '',
    applicationDeadline: '',
    location: '',
    startDate: '',
    duration: '',
    skills: [] as string[],
    qualifications: '',
  });

  const [loading, setLoading] = useState(false);
  const isEditMode = !!initialData;

  // Initialize form with existing data if editing
  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        specialisation: initialData.specialisation || '',
        description: initialData.description || '',
        roleType: initialData.roleType || '',
        salary: initialData.salary || '',
        applicationDeadline: initialData.applicationDeadline || '',
        location: '', // Not in current model
        startDate: '', // Not in current model
        duration: '', // Not in current model
        skills: [], // Not in current model
        qualifications: '', // Not in current model
      });
    }
  }, [initialData]);

  const handleInputChange = (field: string, value: string | string[]) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isEditMode && initialData) {
        // Update existing job
        await updateJob(initialData.id, {
          title: formData.title,
          specialisation: formData.specialisation,
          description: formData.description,
          roleType: formData.roleType,
          salary: formData.salary,
          applicationDeadline: formData.applicationDeadline,
        });
        toast.success('Job updated successfully!');
      } else {
        // Create new job
        await createJob({
          title: formData.title,
          specialisation: formData.specialisation,
          description: formData.description,
          roleType: formData.roleType,
          salary: formData.salary,
          applicationDeadline: formData.applicationDeadline,
          applicationLink: '', // Required field
          datePosted: new Date().toISOString(),
        });
        toast.success('Job created successfully!');
      }
      
      onSave?.();
    } catch (error) {
      console.error('Error saving job:', error);
      toast.error(isEditMode ? 'Failed to update job' : 'Failed to create job');
    } finally {
      setLoading(false);
    }
  };

  const roleTypeOptions = [
    { value: 'Internship', label: 'Internship' },
    { value: 'Graduate', label: 'Graduate' },
    { value: 'Junior', label: 'Junior' },
  ];

  return (
    <main className={styles.jobDetailPageWrapper}>
      <form className={styles.contentWrapper} onSubmit={handleSubmit}>
        {/* Left Column */}
        <div className={styles.leftColumn}>
          <img src="/WDCCLogo.png" alt="Company Logo" className={styles.companyLogo} />
          <div className={styles.leftFields}>
            <TextInput 
              label="Salary" 
              placeholder="Enter salary" 
              className={styles.detailItem}
              value={formData.salary}
              onChange={(e) => handleInputChange('salary', e.currentTarget.value)}
            />
            <TextInput 
              label="Start Date" 
              placeholder="Enter start date" 
              className={styles.detailItem}
              value={formData.startDate}
              onChange={(e) => handleInputChange('startDate', e.currentTarget.value)}
            />
            <TextInput 
              label="Duration" 
              placeholder="Enter duration" 
              className={styles.detailItem}
              value={formData.duration}
              onChange={(e) => handleInputChange('duration', e.currentTarget.value)}
            />
            <TextInput 
              label="Application Deadline" 
              placeholder="Enter application deadline" 
              className={styles.detailItem}
              value={formData.applicationDeadline}
              onChange={(e) => handleInputChange('applicationDeadline', e.currentTarget.value)}
              required
            />
          </div>

          <MultiSelect
            label="Relevant Skills for this Job"
            placeholder="Add skills"
            data={[]}
            className={styles.skillList}
            value={formData.skills}
            onChange={(value) => handleInputChange('skills', value)}
          />
        </div>

        {/* Right Column */}
        <div className={styles.rightColumn}>
          <div className={styles.titleRow}>
            <TextInput 
              label="Job Title" 
              placeholder="Job Title" 
              className={styles.titleInput}
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.currentTarget.value)}
              required
            />
            <div className={styles.badgeField}>
              <label className={styles.badgeLabel}>Role Type</label>
              <Select
                data={roleTypeOptions}
                value={formData.roleType}
                onChange={(value) => handleInputChange('roleType', value || '')}
                placeholder="Select role type"
                required
              />
            </div>
          </div>

          <TextInput 
            label="Location" 
            placeholder="Location" 
            className={styles.fullWidth}
            value={formData.location}
            onChange={(e) => handleInputChange('location', e.currentTarget.value)}
          />

          <div className={styles.buttonRow}>
            <Button type="submit" loading={loading}>
              {isEditMode ? 'Update' : 'Create'}
            </Button>
            <Button variant="outline" type="button" onClick={onCancel}>
              Cancel
            </Button>
          </div>

          <TextInput 
            label="Specialisation" 
            placeholder="Enter specialisation" 
            className={styles.fullWidth}
            value={formData.specialisation}
            onChange={(e) => handleInputChange('specialisation', e.currentTarget.value)}
            required
          />

          <Textarea 
            label="About" 
            placeholder="Type job description here" 
            minRows={4} 
            className={styles.fullWidth}
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.currentTarget.value)}
            required
          />

          <Textarea
            label="Qualifications"
            placeholder="List qualifications here (one per line)"
            minRows={3}
            className={`${styles.fullWidth} ${styles.qualifications}`}
            value={formData.qualifications}
            onChange={(e) => handleInputChange('qualifications', e.currentTarget.value)}
          />

        </div>
      </form>
    </main>
  );
}
