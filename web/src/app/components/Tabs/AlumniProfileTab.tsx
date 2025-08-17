import { Box, Select, TextInput } from '@mantine/core';
import styles from '../Modal/Modal.module.css';
import { useState } from 'react';
import { Alumni } from '@/models/alumni.model';
import { subGroupDisplayMap } from '@/app/utils/field-display-maps';

const subGroupOptions = Object.entries(subGroupDisplayMap).map(([value, label]) => ({
  value,
  label,
}));

const AlumniProfileTab = ({ newUserData, setNewUserData }: { newUserData: Partial<Alumni> | null, setNewUserData: React.Dispatch<React.SetStateAction<Partial<Alumni> | null>>}) => {

  const handleInputChange = (field: keyof Alumni) => (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setNewUserData({...newUserData, [field]: event.currentTarget.value});
  }
  
  const handleSelectChange = (field: keyof Alumni) => (value: string | null) => {
    setNewUserData((prev) => ({ ...(prev ?? {}), [field]: value ?? '' }));
  }

  return (
    <Box>
      <Box className={styles.box}>
        <Box style={{ flex: 1 }}>
          <TextInput value={newUserData?.firstName} onChange={handleInputChange("firstName")} label="First Name" size="md" mb={20}/>
          <TextInput value={newUserData?.lastName} onChange={handleInputChange("lastName")} label="Last Name" size="md" mb={20}/>
          <TextInput value={newUserData?.email as string} onChange={handleInputChange("email")} label="Email" size="md" mb={20} />
        </Box>
        <Box style={{ flex: 1 }}>
          <TextInput value={newUserData?.phoneNumber as string} onChange={handleInputChange("phoneNumber")} label="Phone Number" size="md" mb={20} />
          <TextInput value={newUserData?.companyName as string} onChange={handleInputChange("companyName")} label="Company" size="md" mb={20} />
          <Select value={newUserData?.subGroup} data={subGroupOptions} onChange={handleSelectChange("subGroup")} label="Subgroup" size="md" mb={20}/>
        </Box>
      </Box>
    </Box>
  );
};

export default AlumniProfileTab;
