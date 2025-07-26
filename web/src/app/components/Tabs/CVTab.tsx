import { Dropzone, FileWithPath } from '@mantine/dropzone';
import { IconUpload } from '@tabler/icons-react';
import { Box, Text, Button, Group, Flex, Loader } from '@mantine/core';
import { useRef, useState } from 'react';
import styles from "../Modal/Modal.module.css"
import { delay } from 'lodash';

export const CVTab = () => {
  const openRef = useRef<() => void>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const [errorMsg, setErrorMsg] = useState("Upload failed.");

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
    }
  }
  
  const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

  return (
    <Box className={styles.dropContainer}>
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
              <Text c="blue" mt="lg">Upload successful!</Text>
            )}
            {uploadStatus === 'error' && !uploading && (
              <Text c="red" mt="lg">{errorMsg} Please try again.</Text>
            )}
          </Flex>
        </Dropzone>

        {/* Mobile version with just upload button shown up */}
        <Group justify="center" mt="md" className={styles.mobileDrop}>
          <Button
            leftSection={<IconUpload size={14} />}
            variant="default"
            onClick={() => openRef.current?.()}
            className={styles.mobileButton}
          >
            Upload CV
          </Button>
          
        </Group>
      </Flex>
    </Box>
  );
}
