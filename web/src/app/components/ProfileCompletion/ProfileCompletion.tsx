import {
  Card,
  Title,
  Text,
  TextInput,
  Textarea,
  Button,
  Stack,
  Alert,
  Group,
  Loader,
  Badge,
} from '@mantine/core';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { toast } from 'react-toastify';
import { IconAlertCircle } from '@tabler/icons-react';
import { Role } from '../../type/role';
import styles from './ProfileCompletion.module.css';

interface RequiredField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'tel' | 'textarea';
  required: boolean;
  validation?: (value: string) => string | null;
}

interface ProfileCompletionProps {
  userId: string;
  userRole: Role;
  onComplete?: () => void;
}

// Define required and optional fields for each role
const fieldsByRole: Record<Role, RequiredField[]> = {
  [Role.Member]: [
    { name: 'firstName', label: 'First Name', type: 'text', required: true },
    { name: 'lastName', label: 'Last Name', type: 'text', required: true },
    { name: 'phoneNumber', label: 'Phone Number', type: 'tel', required: true },
    { name: 'subGroup', label: 'FSAE Sub-team', type: 'text', required: false },
    { name: 'description', label: 'About Me', type: 'textarea', required: false },
  ],
  [Role.Alumni]: [
    { name: 'firstName', label: 'First Name', type: 'text', required: true },
    { name: 'lastName', label: 'Last Name', type: 'text', required: true },
    { name: 'phoneNumber', label: 'Phone Number', type: 'tel', required: true },
    { name: 'companyName', label: 'Current Company', type: 'text', required: false },
    { name: 'subGroup', label: 'Former FSAE Sub-team', type: 'text', required: false },
    { name: 'description', label: 'About Me', type: 'textarea', required: false },
  ],
  [Role.Sponsor]: [
    { name: 'companyName', label: 'Company Name', type: 'text', required: true },
    { name: 'phoneNumber', label: 'Phone Number', type: 'tel', required: true },
    { name: 'websiteURL', label: 'Company Website', type: 'text', required: false },
    { name: 'industry', label: 'Industry', type: 'text', required: false },
    { name: 'description', label: 'Company Description', type: 'textarea', required: false },
  ],
  [Role.Admin]: [],
  [Role.Unknown]: [],
};

export function ProfileCompletion({ userId, userRole, onComplete }: ProfileCompletionProps) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [profileData, setProfileData] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [missingFields, setMissingFields] = useState<string[]>([]);
  const [requiredFieldsToShow, setRequiredFieldsToShow] = useState<RequiredField[]>([]);
  const [optionalFieldsToShow, setOptionalFieldsToShow] = useState<RequiredField[]>([]);

  const fields = fieldsByRole[userRole] || [];
  const requiredFields = fields.filter(f => f.required);
  const optionalFields = fields.filter(f => !f.required);

  // Helper function to check if a field is truly empty (matches backend logic)
  const isFieldEmpty = (fieldName: string): boolean => {
    const value = profileData[fieldName];
    return !value || value.trim() === '';
  };

  useEffect(() => {
    fetchUserProfile();
  }, [userId, userRole]);

  const fetchUserProfile = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('accessToken');
      const endpoint = getEndpointByRole(userRole);
      
      const response = await fetch(`http://localhost:3000${endpoint}/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch profile');
      }

      const data = await response.json();
      setProfileData(data);
      
      // Check for missing required fields (only truly empty fields, not placeholder values)
      const missing = requiredFields
        .filter(field => !data[field.name] || data[field.name].trim() === '')
        .map(field => field.name);
      
      setMissingFields(missing);

      // Set fields to show based on what's initially empty (these will remain visible during editing)
      const emptyRequiredFields = requiredFields.filter(field => 
        !data[field.name] || data[field.name].trim() === ''
      );
      const emptyOptionalFields = optionalFields.filter(field => 
        !data[field.name] || data[field.name].trim() === ''
      );
      
      setRequiredFieldsToShow(emptyRequiredFields);
      setOptionalFieldsToShow(emptyOptionalFields);
    } catch (error) {
      toast.error('Failed to load profile data');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const getEndpointByRole = (role: Role): string => {
    switch (role) {
      case Role.Member:
        return '/user/member';
      case Role.Alumni:
        return '/user/alumni';
      case Role.Sponsor:
        return '/user/sponsor';
      default:
        return '/user/member';
    }
  };

  const getDefaultValue = (fieldName: string): string => {
    // Check if field has default placeholder values
    const defaults: Record<string, string> = {
      firstName: 'Fsae',
      lastName: 'member',
      subGroup: 'Fsae club',
    };
    return defaults[fieldName] || '';
  };

  const handleFieldChange = (fieldName: string, value: string) => {
    setProfileData(prev => ({ ...prev, [fieldName]: value }));
    
    // Clear error for this field
    if (errors[fieldName]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[fieldName];
        return newErrors;
      });
    }
  };

  // Check if all required fields are complete (for submit validation)
  const areAllRequiredFieldsComplete = (): boolean => {
    return requiredFields.every(field => {
      const value = profileData[field.name];
      return value && value.trim() !== '';
    });
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    requiredFields.forEach(field => {
      const value = profileData[field.name];
      if (!value || value.trim() === '') {
        newErrors[field.name] = `${field.label} is required`;
      } else if (field.validation) {
        const error = field.validation(value);
        if (error) {
          newErrors[field.name] = error;
        }
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      toast.error('Please fill in all required fields');
      return;
    }

    setSubmitting(true);
    try {
      const token = localStorage.getItem('accessToken');
      const endpoint = getEndpointByRole(userRole);
      
      const response = await fetch(`http://localhost:3000${endpoint}/${userId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(profileData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || 'Failed to update profile');
      }

      toast.success('Profile updated successfully!');
      localStorage.removeItem('profileIncomplete');
      
      if (onComplete) {
        onComplete();
      } else {
        // Navigate to appropriate profile page
        navigate(`/profile/${userRole.toLowerCase()}/${userId}`);
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to update profile');
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Card shadow="sm" padding="xl" radius="md">
        <Group justify="center" p="xl">
          <Loader size="lg" />
        </Group>
      </Card>
    );
  }

  const hasRequiredFields = requiredFieldsToShow.length > 0;
  const hasOptionalFields = optionalFieldsToShow.length > 0;
  const hasAnyFieldsToShow = hasRequiredFields || hasOptionalFields;

  return (
    <Card shadow="sm" padding="xl" radius="md" className={styles.container}>
      <Stack gap="lg">
        {hasRequiredFields && (
          <Alert
            icon={<IconAlertCircle size="1rem" />}
            title="Complete Your Profile"
            color="yellow"
            variant="light"
          >
            Please fill in the required information to continue using the platform.
          </Alert>
        )}

        {!hasAnyFieldsToShow && (
          <Alert
            icon={<IconAlertCircle size="1rem" />}
            title="Profile Complete"
            color="green"
            variant="light"
          >
            Your profile is complete! All required information has been filled in.
          </Alert>
        )}

        <div>
          <Title order={2} mb="sm">
            {hasRequiredFields ? 'Complete Your Profile' : hasAnyFieldsToShow ? 'Edit Profile' : 'Profile Complete'}
          </Title>
          {hasAnyFieldsToShow && (
            <Text c="dimmed" size="sm">
              Fields marked with <Text component="span" c="red" inline>*</Text> are required
            </Text>
          )}
        </div>

        {/* Required Fields Section */}
        {requiredFieldsToShow.length > 0 && (
          <div>
            <Group gap="xs" mb="md">
              <Text fw={500}>Required Information</Text>
              {(() => {
                const missingCount = requiredFields.filter(field => isFieldEmpty(field.name)).length;
                return (
                  <Badge 
                    color={missingCount === 0 ? "green" : "red"} 
                    variant="light" 
                    size="sm"
                  >
                    {missingCount === 0 ? "Complete" : `${missingCount} missing`}
                  </Badge>
                );
              })()}
            </Group>
            <Stack gap="md">
              {requiredFieldsToShow.map(field => (
                <div key={field.name}>
                  {field.type === 'textarea' ? (
                    <Textarea
                      label={
                        <>
                          {field.label} <Text component="span" c="red" inline>*</Text>
                        </>
                      }
                      value={profileData[field.name] || ''}
                      onChange={(e) => handleFieldChange(field.name, e.target.value)}
                      error={errors[field.name]}
                      minRows={3}
                      autosize
                    />
                  ) : (
                    <TextInput
                      label={
                        <>
                          {field.label} <Text component="span" c="red" inline>*</Text>
                        </>
                      }
                      type={field.type}
                      value={profileData[field.name] || ''}
                      onChange={(e) => handleFieldChange(field.name, e.target.value)}
                      error={errors[field.name]}
                      styles={{
                        input: {
                          borderColor: errors[field.name] ? 'var(--mantine-color-red-6)' : undefined,
                        },
                      }}
                    />
                  )}
                </div>
              ))}
            </Stack>
          </div>
        )}

        {/* Optional Fields Section */}
        {optionalFieldsToShow.length > 0 && (
          <div>
            <Text fw={500} mb="md">Optional Information</Text>
            <Stack gap="md">
              {optionalFieldsToShow.map(field => (
                <div key={field.name}>
                  {field.type === 'textarea' ? (
                    <Textarea
                      label={field.label}
                      value={profileData[field.name] || ''}
                      onChange={(e) => handleFieldChange(field.name, e.target.value)}
                      minRows={3}
                      autosize
                    />
                  ) : (
                    <TextInput
                      label={field.label}
                      type={field.type}
                      value={profileData[field.name] || ''}
                      onChange={(e) => handleFieldChange(field.name, e.target.value)}
                    />
                  )}
                </div>
              ))}
            </Stack>
          </div>
        )}

        <Group justify="space-between" mt="xl">
          {!hasAnyFieldsToShow ? (
            <Button
              onClick={() => navigate(`/profile/${userRole.toLowerCase()}/${userId}`)}
              disabled={submitting}
            >
              Go to Profile
            </Button>
          ) : (
            <>
              {!hasRequiredFields && (
                <Button
                  variant="subtle"
                  onClick={() => navigate(`/profile/${userRole.toLowerCase()}/${userId}`)}
                  disabled={submitting}
                >
                  Cancel
                </Button>
              )}
              <Button
                loading={submitting}
                onClick={handleSubmit}
                disabled={!areAllRequiredFieldsComplete()}
                style={{ marginLeft: hasRequiredFields ? 'auto' : undefined }}
              >
                {hasRequiredFields ? 'Complete Profile' : 'Save Changes'}
              </Button>
            </>
          )}
        </Group>
      </Stack>
    </Card>
  );
}