import { Box, Avatar, Divider, Flex, ActionIcon, Text, FileButton, Group } from '@mantine/core';
import styles from './Modal.module.css';
import { IconCameraPlus } from '@tabler/icons-react';
import { IconTrash } from '@tabler/icons-react';
import { useState } from 'react';
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/app/store';

interface EditAvatarProps {
  avatar: string;
}

export const EditAvatar = ({ avatar }: EditAvatarProps) => {
  const user = useSelector((state: RootState) => state.user);
  const memberID = user.id;
  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

  const [avatarUrl, setAvatarUrlState] = useState<string>('');
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [clearing, setClearing] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const fetchAvatar = async () => {
    if (!memberID) return;

    setLoading(true);
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`http://localhost:3000/user/member/${memberID}/avatar`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        setAvatarUrlState(url);
      }
    } catch (error) {
      console.error('Error fetching avatar:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch existing avatar on mount
  useEffect(() => {
    fetchAvatar();
  }, [memberID]);

  const handleAvatarUpload = async (selectedFile: File | null) => {
    if (!selectedFile) {
      return;
    }

    if (selectedFile.size > MAX_FILE_SIZE) {
      setUploadStatus('error');
      setErrorMsg("File too large. Maximum size is 5MB.");
      return;
    }

    setUploading(true);
    setErrorMsg('');
    setUploadStatus('idle');
    const token = localStorage.getItem('accessToken');

    try {
      const formData = new FormData();
      formData.append('avatar', selectedFile);

      const response = await fetch(`http://localhost:3000/user/member/${memberID}/upload-avatar`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (!response.ok) {
        setUploadStatus('error');
        throw new Error('Failed to upload avatar.');
      }

      const data = await response.json();
      if (data.success && data.url) {
        const urlForced = `${data.url}?t=${Date.now()}`;
        setAvatarUrlState(urlForced);
        setUploadStatus('success');
        await fetchAvatar();
      }
    } catch (error: any) {
      setUploadStatus('error');
      setErrorMsg(error.message || 'Upload failed.');
    } finally {
      setUploading(false);
    }
  };


  const handleAvatarDelete = async () => {
    setClearing(true);
    const token = localStorage.getItem('accessToken');
    try {
      const response = await fetch(`http://localhost:3000/user/member/${memberID}/delete-avatar`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        throw new Error('Failed to delete avatar.');
      }

      setAvatarUrlState('');
    } catch (error: any) {
      console.error(error);
      setErrorMsg(error.message || 'Failed to delete avatar.');
    } finally {
      setClearing(false);
    }
  };

  return (
    <Box>
      <Flex align="center" justify="center" mb={20}>
        <Avatar radius="xl" className={styles.avatar} variant="transparent" src={avatarUrl || avatar} />
      </Flex>
      <Group justify="center" mb="md">    
        {uploadStatus === 'success' && !uploading && (
          <Text c="blue" mt="lg">Update successful!</Text>
        )}
        {uploadStatus === 'error' && !uploading && (
          <Text c="red" mt="lg">{errorMsg} Please try again.</Text>
        )}
      </Group>
      <Divider size="md" />
      <Flex justify="space-between">
              
        <FileButton onChange={
          (file) => {
            setFile(file);
            handleAvatarUpload(file);
        }}
        accept="image/png,image/jpeg">
          {(props) => (
            <button {...props} className={styles.modalButton}>
              <Flex direction="column" align="center">
                <ActionIcon variant="transparent">
                  <IconCameraPlus stroke={2} className={styles.icon} />
                </ActionIcon>
                <Text style={{ cursor: 'pointer' }}>Add Photo</Text>
              </Flex>
            </button>
          )}
        </FileButton>

        <button
          className={styles.modalButton}
          onClick={handleAvatarDelete}
          disabled={clearing}
        >
          <Flex direction="column" align="center">
            <ActionIcon variant="transparent">
              <IconTrash stroke={2} className={styles.icon} />
            </ActionIcon>
            <Text style={{ cursor: 'pointer' }}>Delete</Text>
          </Flex>
        </button>
      </Flex>
    </Box>
  );
};
