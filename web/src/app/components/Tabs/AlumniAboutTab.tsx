import { Box, Textarea } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import styles from '../Modal/Modal.module.css';
import { useState } from 'react';

const AlumniAboutTab = ({ userData }) => {
  const [formData, setFormData] = useState({
    description: userData.description || '',
  });

  const handleInputChange = (field) => (event) => {
    setFormData({
      ...formData,
      [field]: event.currentTarget.value,
    });
  };

  const isMobile = useMediaQuery('(max-width: 430px)'); //mobile screen

  return (
    <Box>
      {!isMobile ? (
        <Textarea
          px={50}
          minRows={10}
          maxRows={15}
          autosize
          value={formData.description}
          onChange={handleInputChange('description')}
        ></Textarea>
      ) : (
        <Textarea
          px={10}
          minRows={5}
          maxRows={20}
          autosize
          value={formData.description}
          onChange={handleInputChange('description')}
        ></Textarea>
      )}
    </Box>
  );
};

export default AlumniAboutTab;
