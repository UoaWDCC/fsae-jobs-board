// Currently not used

import { Modal, TextInput, Textarea, Button, Select, Stack, Group, Text } from '@mantine/core';
import { useState, useEffect } from 'react';
import { Job } from '@/models/job.model';
import { createJob, updateJob } from '@/api/job';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';

interface JobEditorModalProps {
  opened: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialData?: Job | null;
  mode: 'create' | 'edit';
}

interface FormData {
  title: string;
  specialisation: string;
  description: string;
  roleType: string;
  salary: string;
  applicationDeadline: string;
  applicationLink: string;
}

export function JobEditorModal({ opened, onClose, onSuccess, initialData, mode }: JobEditorModalProps) {
  const [formData, setFormData] = useState<FormData>({
    title: '',
    specialisation: '',
    description: '',
    roleType: '',
    salary: '',
    applicationDeadline: '',
    applicationLink: '',
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const userRole = useSelector((state: RootState) => state.user.role);
  const userId = useSelector((state: RootState) => state.user.id);

  // Check if user can edit this job
  const canEdit = userRole === 'sponsor' || userRole === 'alumni';
  const isOwner = initialData && userId && initialData.publisherID === userId;

  // Initialize form with existing data if editing
  useEffect(() => {
    if (initialData && mode === 'edit') {
      setFormData({
        title: initialData.title || '',
        specialisation: initialData.specialisation || '',
        description: initialData.description || '',
        roleType: initialData.roleType || '',
        salary: initialData.salary || '',
        applicationDeadline: initialData.applicationDeadline || '',
        applicationLink: initialData.applicationLink || '',
      });
    } else if (mode === 'create') {
      setFormData({
        title: '',
        specialisation: '',
        description: '',
        roleType: '',
        salary: '',
        applicationDeadline: '',
        applicationLink: '',
      });
    }
  }, [initialData, mode, opened]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.specialisation.trim()) {
      newErrors.specialisation = 'Specialisation is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (!formData.roleType || formData.roleType.trim() === '') {
      newErrors.roleType = 'Role type is required';
    }
    
    // Validate roleType is one of the allowed values
    const validRoleTypes = ['Internship', 'Graduate', 'Junior'];
    if (formData.roleType && !validRoleTypes.includes(formData.roleType.trim())) {
      newErrors.roleType = 'Role type must be one of: Internship, Graduate, Junior';
    }

    if (!formData.applicationDeadline) {
      newErrors.applicationDeadline = 'Application deadline is required';
    }

    if (!formData.applicationLink.trim()) {
      newErrors.applicationLink = 'Application link is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (!canEdit) {
      toast.error('You do not have permission to edit jobs');
      return;
    }

    if (mode === 'edit' && !isOwner) {
      toast.error('You can only edit your own job posts');
      return;
    }

    if (mode === 'create' && !userId) {
      toast.error('User ID not found. Please log in again.');
      return;
    }

    setLoading(true);

    try {
      if (mode === 'edit' && initialData) {
        // Update existing job - ensure date format is consistent with create
        const updateData: any = {
          title: formData.title.trim(),
          specialisation: formData.specialisation.trim(),
          description: formData.description.trim(),
          roleType: formData.roleType.trim(),
          applicationDeadline: new Date(formData.applicationDeadline).toISOString(),
          applicationLink: formData.applicationLink.trim(),
        };
        
        // Only include salary if it's not empty
        if (formData.salary && formData.salary.trim()) {
          updateData.salary = formData.salary.trim();
        }
        
        console.log('Updating job with data:', updateData);
        await updateJob(initialData.id, updateData);
        toast.success('Job updated successfully!');
      } else {
        // Create new job - ensure all required fields are properly set
        const jobData: any = {
          title: formData.title.trim(),
          specialisation: formData.specialisation.trim(),
          description: formData.description.trim(),
          roleType: formData.roleType.trim() || 'Internship',
          applicationDeadline: new Date(formData.applicationDeadline).toISOString(),
          applicationLink: formData.applicationLink.trim(),
          datePosted: new Date().toISOString(),
          // Note: publisherID is automatically set by the backend from the current user
        };
        
        // Only include salary if it's not empty
        if (formData.salary && formData.salary.trim()) {
          jobData.salary = formData.salary.trim();
        }
        
        console.log('Creating job with data:', jobData);
        await createJob(jobData);
        toast.success('Job created successfully!');
      }
      
      onSuccess();
      onClose();
    } catch (error: any) {
      console.error('Error saving job:', error);
      if (error.response) {
        console.error('Backend response:', error.response.data);
        console.error('Backend status:', error.response.status);
        console.error('Backend headers:', error.response.headers);
        
        // Provide more specific error messages
        const errorMessage = error.response.data?.error?.message || 
                           error.response.data?.message || 
                           error.response.statusText || 
                           'Unknown error';
        toast.error(`${mode === 'edit' ? 'Failed to update job' : 'Failed to create job'}: ${errorMessage}`);
      } else if (error.message) {
        toast.error(`${mode === 'edit' ? 'Failed to update job' : 'Failed to create job'}: ${error.message}`);
      } else {
        toast.error(mode === 'edit' ? 'Failed to update job' : 'Failed to create job');
      }
    } finally {
      setLoading(false);
    }
  };

  const roleTypeOptions = [
    { value: 'Internship', label: 'Internship' },
    { value: 'Graduate', label: 'Graduate' },
    { value: 'Junior', label: 'Junior' },
  ];

  if (!canEdit) {
    return null;
  }

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={mode === 'edit' ? 'Edit Job Post' : 'Create New Job Post'}
      size="lg"
      centered
    >
      <Stack gap="md">
        <TextInput
          label="Job Title"
          placeholder="Enter job title"
          value={formData.title}
          onChange={(e) => handleInputChange('title', e.target.value)}
          error={errors.title}
          required
        />

        <TextInput
          label="Specialisation"
          placeholder="e.g., Software Engineering, Mechanical Engineering"
          value={formData.specialisation}
          onChange={(e) => handleInputChange('specialisation', e.target.value)}
          error={errors.specialisation}
          required
        />

        <Select
          label="Role Type"
          placeholder="Select role type"
          data={roleTypeOptions}
          value={formData.roleType}
          onChange={(value) => handleInputChange('roleType', value || '')}
          error={errors.roleType}
          required
        />

        <TextInput
          label="Salary"
          placeholder="e.g., $50,000 - $70,000"
          value={formData.salary}
          onChange={(e) => handleInputChange('salary', e.target.value)}
        />

        <TextInput
          label="Application Link"
          placeholder="https://company.com/apply"
          value={formData.applicationLink}
          onChange={(e) => handleInputChange('applicationLink', e.target.value)}
          error={errors.applicationLink}
          required
        />

        <TextInput
          label="Application Deadline"
          type="date"
          value={formData.applicationDeadline}
          onChange={(e) => handleInputChange('applicationDeadline', e.target.value)}
          error={errors.applicationDeadline}
          required
        />

        <Textarea
          label="Job Description"
          placeholder="Describe the role, responsibilities, and requirements..."
          value={formData.description}
          onChange={(e) => handleInputChange('description', e.target.value)}
          error={errors.description}
          required
          minRows={4}
        />

        <Group justify="flex-end" gap="sm">
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} loading={loading}>
            {mode === 'edit' ? 'Update Job' : 'Create Job'}
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
}
