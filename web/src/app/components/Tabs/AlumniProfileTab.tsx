import { Box, TextInput } from '@mantine/core';
import styles from '../Modal/Modal.module.css';
import { useState } from 'react';

const AlumniProfileTab = ({ userData }) => {
  //   const [value, setValue] = useState('');
  const [formData, setFormData] = useState({
    alumniName: userData.alumniName || '',
    companyField: userData.companyField || '',
    phone: userData.phone || '',
  });

  const handleInputChange = (field) => (event) => {
    setFormData({
      ...formData,
      [field]: event.currentTarget.value,
    });
  };

  return (
    <Box>
      <Box className={styles.box}>
        <Box style={{ flex: 1 }}>
          <TextInput
            label="Name"
            size="md"
            mb={20}
            value={formData.alumniName}
            onChange={handleInputChange('alumniName')}
          />
          <TextInput label="Current Role" size="md" mb={20} />
        </Box>
        <Box style={{ flex: 1 }}>
          <TextInput
            label="Company"
            size="md"
            mb={20}
            value={formData.companyField}
            onChange={handleInputChange('companyField')}
          />
          <TextInput
            label="Phone"
            size="md"
            mb={20}
            value={formData.phone}
            onChange={handleInputChange('phone')}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default AlumniProfileTab;
