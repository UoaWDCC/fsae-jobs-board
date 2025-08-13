import { Box, TextInput } from '@mantine/core';
import styles from '../Modal/Modal.module.css';
import { useState } from 'react';
import { Alumni } from '@/models/alumni.model';

const AlumniProfileTab = ({ newUserData, setNewUserData }: { newUserData: Partial<Alumni> | null, setNewUserData: React.Dispatch<React.SetStateAction<Partial<Alumni> | null>>}) => {

  const handleFieldChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setNewUserData({...newUserData, [field]: event.currentTarget.value});
  }

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const fullName = event.currentTarget.value;
    const names = fullName.split(' ');
    const firstName = names[0] || '';
    const lastName = names.slice(1).join(' ') || '';
    setNewUserData({...newUserData, firstName, lastName});
  }

  return (
    <Box>
      <Box className={styles.box}>
        <Box style={{ flex: 1 }}>
          <TextInput
            label="Name"
            size="md"
            mb={20}
            value={`${newUserData?.firstName || ''} ${newUserData?.lastName || ''}`.trim()}
            onChange={handleNameChange}
          />
          <TextInput 
            label="Current Role" 
            size="md" 
            mb={20} 
            value={newUserData?.subGroup || ''} 
            onChange={handleFieldChange("subGroup")} 
          />
        </Box>
        <Box style={{ flex: 1 }}>
          <TextInput
            label="Company"
            size="md"
            mb={20}
            value={newUserData?.company || ''} 
            onChange={handleFieldChange("company")}
          />
          <TextInput
            label="Phone"
            size="md"
            mb={20}
            value={newUserData?.phoneNumber || ''} 
            onChange={handleFieldChange("phoneNumber")}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default AlumniProfileTab;
