import { TextInput, Textarea, Button, Select, Group, Checkbox, Stack, Modal, Avatar } from '@mantine/core';
import { useState, useEffect } from 'react';
import styles from './JobDetail.module.css';
import { Job } from '@/models/job.model';
import { createJob, updateJob, deleteJob } from '@/api/job';
import { createJobForm } from '@/api/tally';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { TallyFormBuilder, FormField } from '../TallyFormBuilder';
import { CreateFormRequest } from '@/schemas/tally/requests/create-form-request';
import { ZodError } from 'zod';
import { convertToTallyBlocks } from '@/utils/tallyFormUtils';
import { useUserAvatar } from '@/hooks/useUserAvatar';


interface JobEditorModalProps {
  initialData?: Job | null;
  mode: 'create' | 'edit';
  isEditMode?: boolean;
  onCancel?: () => void;
  onSave?: () => void;
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

export function JobDetailEditor({onSave, onCancel, initialData, mode}: JobEditorModalProps) {
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

  // Tally form state
  const [enableTallyForm, setEnableTallyForm] = useState(false);
  const [showFormBuilder, setShowFormBuilder] = useState(false);
  const [formTitle, setFormTitle] = useState('Job Application Form');
  const [formFields, setFormFields] = useState<FormField[]>([]);

  const { avatarUrl: posterAvatar } = useUserAvatar(initialData?.publisherID);

  const userRole = useSelector((state: RootState) => state.user.role);
  const userId = useSelector((state: RootState) => state.user.id);

  // Check if user can edit this job
  const canEdit = userRole === 'sponsor' || userRole === 'alumni';
  const isOwner = initialData && userId && initialData.publisherID === userId;
  const isEditMode = mode === 'edit';

  useEffect(() => {
    if (initialData && mode === 'edit') {
      // Convert ISO date to YYYY-MM-DD for input[type="date"]
      let deadline = '';
      if (initialData.applicationDeadline) {
        const d = new Date(initialData.applicationDeadline);
        deadline = d.toISOString().slice(0, 10); // YYYY-MM-DD
      }
      setFormData({
        title: initialData.title || '',
        specialisation: initialData.specialisation || '',
        description: initialData.description || '',
        roleType: initialData.roleType || '',
        salary: initialData.salary || '',
        applicationDeadline: deadline,
        applicationLink: initialData.applicationLink || '',
      });
    } else if (mode === 'create') {
      // Reset form for creating new job
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
  }, [initialData, mode]);

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

  // Form builder handlers
  const handleFormBuilderSave = (savedFormTitle: string, fields: FormField[]) => {
    setFormTitle(savedFormTitle);
    setFormFields(fields);
    setShowFormBuilder(false);
    toast.success(`Form configured with ${fields.length} fields!`);
  };

  const handleFormBuilderCancel = () => {
    setShowFormBuilder(false);
  };

  // convertToTallyBlocks moved to /web/src/utils/tallyFormUtils.ts (shared utility)

  /**
   * Pre-validate form blocks using backend Zod schemas
   * Prevents job creation if form would fail backend validation
   *
   * This is Tier 1 protection against limbo state (job exists but no form)
   */
  const validateFormBlocks = (blocks: any[]): { isValid: boolean; error?: string } => {
    try {
      // Use the exact same schema the backend will use
      CreateFormRequest.parse({
        name: formTitle,
        status: 'PUBLISHED',
        blocks: blocks
      });

      return { isValid: true };
    } catch (error) {
      if (error instanceof ZodError) {
        // Format validation errors for user
        const firstError = error.issues[0];
        const errorPath = firstError.path.join('.') || '(root)';
        const errorMessage = `Form validation failed: ${firstError.message} at ${errorPath}`;

        console.error('Form pre-validation failed:', error.issues);
        return { isValid: false, error: errorMessage };
      }

      return { isValid: false, error: 'Form validation failed' };
    }
  };

  const handleSubmit = async (event?: React.FormEvent) => {
    if (event) event.preventDefault(); // Prevent page reload

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
          roleType: formData.roleType.trim(),
          applicationDeadline: new Date(formData.applicationDeadline).toISOString(),
          applicationLink: formData.applicationLink.trim(),
          datePosted: new Date().toISOString(),
          // Note: publisherID is automatically set by the backend from the current user
        };

        // Only include salary if it's not empty
        if (formData.salary && formData.salary.trim()) {
          jobData.salary = formData.salary.trim();
        }

        // Tier 1: Pre-validate form BEFORE creating job (prevents limbo state)
        if (enableTallyForm) {
          const blocks = formFields.length > 0
            ? convertToTallyBlocks(formTitle, formFields)
            : [];

          const validation = validateFormBlocks(blocks);

          if (!validation.isValid) {
            // Form would fail backend validation - don't create job!
            toast.error(validation.error || 'Form configuration is invalid');
            setLoading(false);
            return; // Stop here - don't create job
          }

          console.log('Form pre-validation passed ✓');
        }

        // Validation passed (if enabled) - safe to create job
        console.log('Creating job with data:', jobData);
        const createdJob = await createJob(jobData);
        toast.success('Job created successfully!');

        // Create Tally form if enabled (with Tier 2 rollback)
        if (enableTallyForm && createdJob.id) {
          try {
            const blocks = formFields.length > 0
              ? convertToTallyBlocks(formTitle, formFields)
              : [];

            await createJobForm(createdJob.id, {
              name: formTitle,
              status: 'PUBLISHED',
              blocks: blocks
            });
            toast.success('Application form created successfully!');
          } catch (formError: any) {
            console.error('Failed to create application form:', formError);

            // Tier 2: Rollback - delete the job we just created
            toast.warning('Form creation failed. Rolling back job creation...');

            try {
              await deleteJob(createdJob.id);
              toast.error('Job creation cancelled due to form validation failure. Please check your form configuration and try again.');
              setLoading(false);
              return; // Stop here - rollback complete
            } catch (deleteError: any) {
              console.error('Failed to rollback job creation:', deleteError);
              toast.error('Critical error: Job was created but form failed. Please contact support to resolve this issue.');
              setLoading(false);
              return; // Stop here - critical error
            }
          }
        }
      }

      // Call onSave callback if provided
      if (onSave) {
        onSave();
      }

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
    return (
      <main className={styles.jobDetailPageWrapper}>
        <div className={styles.contentWrapper}>
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <h2>Access Denied</h2>
            <p>You do not have permission to edit job posts.</p>
            <Button variant="outline" onClick={onCancel}>
              Go Back
            </Button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className={styles.jobDetailPageWrapper}>
      <form className={styles.contentWrapper} onSubmit={(e) => handleSubmit(e)}>
        {/* Left Column */}
        <div className={styles.leftColumn}>
          <Avatar src={posterAvatar} alt={"Company Logo"} className={styles.companyLogo} />
          <div className={styles.leftFields}>
            <TextInput 
              label="Salary" 
              placeholder="Enter salary" 
              className={styles.detailItem}
              value={formData.salary}
              onChange={(e) => handleInputChange('salary', e.currentTarget.value)}
            />
            <TextInput 
              label="Application Deadline" 
              type="date"
              placeholder="Enter application deadline" 
              className={styles.detailItem}
              value={formData.applicationDeadline}
              onChange={(e) => handleInputChange('applicationDeadline', e.currentTarget.value)}
              error={errors.applicationDeadline}
              required
            />
            <TextInput
              label="Application Link"
              placeholder="https://company.com/apply"
              className={styles.detailItem}
              value={formData.applicationLink}
              onChange={(e) => handleInputChange('applicationLink', e.currentTarget.value)}
              error={errors.applicationLink}
              required
            />

            {/* Tally Form Creation Option (Create mode only) */}
            {mode === 'create' && (
              <Stack gap="sm" className={styles.detailItem}>
                <Checkbox
                  label="Create application form"
                  description="Collect applications directly on your platform with a custom form"
                  checked={enableTallyForm}
                  onChange={(e) => setEnableTallyForm(e.currentTarget.checked)}
                />
                {enableTallyForm && (
                  <Button
                    variant="light"
                    onClick={() => setShowFormBuilder(true)}
                    fullWidth
                  >
                    {formFields.length > 0
                      ? `Edit Form (${formFields.length} fields configured)`
                      : 'Configure Form Fields'
                    }
                  </Button>
                )}
              </Stack>
            )}
          </div>
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
              error={errors.title}
              required
            />
            <div className={styles.badgeField}>
              <label className={styles.badgeLabel}>Role Type</label>
              <Select
                data={roleTypeOptions}
                value={formData.roleType}
                onChange={(value) => handleInputChange('roleType', value || '')}
                placeholder="Select role type"
                error={errors.roleType}
                required
              />
            </div>
          </div>


          <div className={styles.buttonRow}>
            <Group gap="sm">
              <Button type="submit" loading={loading}>
                {mode === 'edit' ? 'Update Job' : 'Save & Continue'}
              </Button>
              <Button variant="outline" type="button" onClick={onCancel} disabled={loading}>
                Cancel
              </Button>
            </Group>
          </div>

          <TextInput 
            label="Specialisation" 
            placeholder="Enter specialisation" 
            className={styles.fullWidth}
            value={formData.specialisation}
            onChange={(e) => handleInputChange('specialisation', e.currentTarget.value)}
            error={errors.specialisation}
            required
          />

          <Textarea 
            label="About" 
            placeholder="Type job description here" 
            minRows={4} 
            className={styles.fullWidth}
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.currentTarget.value)}
            error={errors.description}
            required
          />

        </div>
      </form>

      {/* Form Builder Modal */}
      <Modal
        opened={showFormBuilder}
        onClose={handleFormBuilderCancel}
        title="Configure Application Form"
        size="xl"
        centered
      >
        <TallyFormBuilder
          initialFormTitle={formTitle}
          onSave={handleFormBuilderSave}
          onCancel={handleFormBuilderCancel}
        />
      </Modal>
    </main>
  );
}
