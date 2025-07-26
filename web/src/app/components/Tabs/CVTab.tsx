import { Dropzone, FileWithPath } from '@mantine/dropzone';
import { IconTrash, IconUpload } from '@tabler/icons-react';
import { Box, Text, Button, Group, Flex, Loader } from '@mantine/core';
import { useEffect, useRef, useState } from 'react';
import styles from "../Modal/Modal.module.css"
import { delay } from 'lodash';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/app/store';
import { setCVStatus } from "@/app/features/user/userSlice";

export const CVTab = () => {
  const dispatch = useDispatch();
  const openRef = useRef<() => void>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [clearing, setClearing] = useState(false);
  const [hasCV, setHasCV] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const [errorMsg, setErrorMsg] = useState("Upload failed.");

  const user = useSelector((state: RootState) => state.user);
  const memberID = user.id;

  // check if user has a CV when component mounts
  useEffect(() => {
    const checkCVStatus = async () => {
      if (!memberID) return;

      try {
        const token = localStorage.getItem('accessToken');
        const response = await fetch(`http://localhost:3000/user/member/${memberID}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const memberData = await response.json();
          setHasCV(memberData.hasCV || false);
          dispatch(setCVStatus({ hasCV: memberData.hasCV || false }));
        }
      } catch (error) {
        console.error('Error checking CV status:', error);
      }
    };
    checkCVStatus();
  }, [memberID]);
    

  const handleFileUpload = async (files: FileWithPath[]) => {
    if (files.length === 0) {
      return;
    }

    const file = files[0];
    
    // validation of file type and size
    if (!['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'].includes(file.type)) {
      setUploadStatus('error');
      setErrorMsg("Invalid file format.");
      return;
    }

    if (file.size > 16 * 1024 * 1024) { // 16MB limit
      setUploadStatus('error');
      setErrorMsg("File too large.");
      return;
    }

    setUploading(true);
    setUploadedFile(file);

    try {
      await uploadCVToDatabase(file);
      // await delay(2000);
      setUploadStatus('success'); // fake delay to see spinner
    } catch (error) {
      setUploadStatus('error');
      console.error('Upload failed:', error);
    } finally {
      setUploading(false);
    }
  }

  const uploadCVToDatabase = async (file: File) => {
    const token = localStorage.getItem('accessToken');
    console.log("TOKEN", localStorage.getItem('accessToken'));
    if (!token) {
      throw new Error('No authentication token found.');
    }

    const formData = new FormData();
    formData.append('cv', file);

    const response = await fetch('http://localhost:3000/user/member/upload-cv', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Upload failed');
    } else {
      console.log('CV uploaded successfully');
      dispatch(setCVStatus({ hasCV: true }));
    }
  }

  const handleClearCV = async () => {
    if (!memberID) {
      setErrorMsg("User not authenticated.");
      setUploadStatus('error');
      return;
    }

    setClearing(true);

    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`http://localhost:3000/user/member/${memberID}/delete-cv`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        console.log('response ok');
        setHasCV(false);
        setUploadedFile(null);
        setUploadStatus('success');
        console.log('CV removed successfully');
        dispatch(setCVStatus({ hasCV: false }));
      } else {
        throw new Error('Failed to remove CV');
      }
      console.log('CV removed successfully');
    } catch (error) {
      console.error('Error removing CV:', error);
      setErrorMsg("Failed to remove CV.");
      setUploadStatus('error');
    } finally {
      setClearing(false);
    }
  }
  
  const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

  return (
    <Box className={styles.dropContainer}>
      <Button mb="lg"
        leftSection={<IconTrash size={14} />}
        color="red"
        onClick={handleClearCV}
        loading={clearing}
        disabled={uploading}
      >
        Remove CV
      </Button>

      <Flex direction="column" align="center" justify="center" className={styles.dropWrapper}>

        <Dropzone openRef={openRef} classNames={{ root: styles.dropRoot }} onDrop={handleFileUpload} loading={uploading} >
          <Flex justify="center" align="center" direction="column">
            <IconUpload stroke={2} className={styles.dropIcon} />
            <Text>Drop your file here</Text>
            <Text>or</Text>
              <Button onClick={() => openRef.current?.()} className={styles.dropButton}>
                Browse
              </Button>
            <Text mt="xs" size="sm" c="dimmed">
              File size cannot exceed 16MB and must be of .pdf, .doc, or .docx format
            </Text>
            {uploadStatus === 'success' && !uploading && (
              <Text c="blue" mt="lg">Update successful!</Text>
            )}
            {uploadStatus === 'error' && !uploading && (
              <Text c="red" mt="lg">{errorMsg} Please try again.</Text>
            )}
          </Flex>
        </Dropzone>

        {/* Mobile version with just upload button shown up */}
        <Group justify="center" mt="md" className={styles.mobileDrop}>
            {uploading ? (
              <Loader size="sm" />
            ) : (
              <Button
                leftSection={<IconUpload size={14} />}
                variant="default"
                onClick={() => openRef.current?.()}
                className={styles.mobileButton}
              >
                Upload CV
              </Button>
            )}
              {uploadStatus === 'success' && !uploading && (
                <Text c="blue" mt="lg">Update successful!</Text>
              )}
              {uploadStatus === 'error' && !uploading && (
                <Text c="red" mt="lg">{errorMsg} Please try again.</Text>
              )}
        </Group>
        
      </Flex>
    </Box>
  );
}
