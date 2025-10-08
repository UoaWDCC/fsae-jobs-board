import { Box, Divider, Flex, ActionIcon, Text, Image, FileButton, Group } from '@mantine/core';
import styles from './Modal.module.css';
import { IconPencil } from '@tabler/icons-react';
import { IconTrash } from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/app/store';

//theres more than one class of user that have banners. atm hardcoded only to serve members. please fix and generalise later! at the time of this comment
//alumni backend has been done to support banners and avatars, sponsor needs to be done iirc.
interface EditBannerModalProps {
  banner: string | null | undefined;
}

export const EditBannerModal = ({ banner }: EditBannerModalProps) => {
  const user = useSelector((state: RootState) => state.user);
  const memberID = user.id;
  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

  const [bannerUrl, setBannerUrlState] = useState<string>('');
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [clearing, setClearing] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const fetchBanner = async () => {
    if (!memberID) return;

    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`http://localhost:3000/user/member/${memberID}/banner`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        setBannerUrlState(url);
      }
    } catch (error) {
      console.error('Error fetching banner :', error);
    }
  };

  const handleBannerDelete = async () => {
    setClearing(true);
    const token = localStorage.getItem('accessToken');
    try {
      const response = await fetch(`http://localhost:3000/user/member/${memberID}/delete-banner`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        setErrorMsg('Failed to delete banner.');
      }

      setBannerUrlState('');
      setUploadStatus('success');
    } catch (error: any) {
      console.error(error);
      setErrorMsg(error.message || 'Failed to delete banner.');
    } finally {
      setClearing(false);
    }
  };

  // Fetch existing banner on mount
  useEffect(() => {
    fetchBanner();
  }, [memberID]);

  const handleBannerUpload = async (selectedFile: File | null) => {
    if (!selectedFile) {
      return;
    }
    setUploadStatus('idle');

    if (selectedFile.size > MAX_FILE_SIZE) {
      setUploadStatus('error');
      setErrorMsg('File too large. Maximum size is 5MB.');
      return;
    }

    setUploading(true);
    setErrorMsg('');
    const token = localStorage.getItem('accessToken');

    try {
      const formData = new FormData();
      formData.append('banner', selectedFile);

      const response = await fetch(`http://localhost:3000/user/member/${memberID}/upload-banner`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (!response.ok) {
        setUploadStatus('error');
      }

      const data = await response.json();
      if (data.success && data.url) {
        const urlForced = `${data.url}?t=${Date.now()}`;
        setBannerUrlState(urlForced);
        setUploadStatus('success');
        await fetchBanner();
      }
    } catch (error: any) {
      setUploadStatus('error');
      setErrorMsg(error.message || 'Upload failed.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <Box>
      <Flex align="center" justify="center" className={styles.bannerWrapper}>
        <Image src={bannerUrl || banner} className={styles.banner} />
      </Flex>
      <Group justify="center" mb="md">
        {uploadStatus === 'success' && !uploading && (
          <Text c="blue" mt="lg">
            Update successful!
          </Text>
        )}
        {uploadStatus === 'error' && !uploading && (
          <Text c="red" mt="lg">
            {errorMsg} Please try again.
          </Text>
        )}
      </Group>
      <Divider size="md" />
      <Flex justify="space-between">
        <FileButton
          onChange={(file) => {
            setFile(file);
            handleBannerUpload(file);
          }}
          accept="image/png,image/jpeg"
        >
          {(props) => (
            <button {...props} className={styles.modalButton}>
              <Flex direction="column" align="center">
                <ActionIcon variant="transparent">
                  <IconPencil stroke={2} className={styles.icon} />
                </ActionIcon>
                <Text style={{ cursor: 'pointer' }}>Add Photo</Text>
              </Flex>
            </button>
          )}
        </FileButton>
        <button className={styles.modalButton} onClick={handleBannerDelete} disabled={clearing}>
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
