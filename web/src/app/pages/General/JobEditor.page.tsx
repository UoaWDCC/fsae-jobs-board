import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { JobDetailEditor } from '../../components/JobDetail/JobDetailEditor';
import { Job } from '@/models/job.model';
import { fetchJobById } from '@/api/job';
import { toast } from 'react-toastify';
import { RootState } from '../../store';
import { useSelector } from 'react-redux';

export function JobEditorPage() {
  const userRole = useSelector((state: RootState) => state.user.role);
  const userId = useSelector((state: RootState) => state.user.id);
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [jobData, setJobData] = useState<Job | null>(null);
  const [loading, setLoading] = useState(false);

  const mode = id ? 'edit' : 'create';

  // Fetch job data if editing
  useEffect(() => {
    if (id) {
      setLoading(true);
      fetchJobById(id)
        .then((job) => {
          if (job) {
            setJobData(job);
          } else {
            toast.error('Job not found');
            navigate('/jobs');
          }
        })
        .catch((error) => {
          console.error('Failed to fetch job:', error);
          toast.error('Failed to load job data');
          navigate('/jobs');
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [id, navigate]);

  const handleSave = () => {
    toast.success(mode === 'edit' ? 'Job updated successfully!' : 'Job created successfully!');
    navigate('/jobs');
  };

  const handleCancel = () => {
    navigate(`/profile/${userRole}/${userId}`);
  };

  const handleNextStep = () => {
    // This can be extended for multi-step job creation
    toast.info('Next step functionality coming soon!');
  };

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '50vh' 
      }}>
        <div>Loading...</div>
      </div>
    );
  }

  return (
    <JobDetailEditor
      initialData={jobData}
      mode={mode}
      onSave={handleSave}
      onCancel={handleCancel}
    />
  );
}
