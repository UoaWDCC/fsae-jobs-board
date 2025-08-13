import { Box, TextInput } from '@mantine/core';
import styles from '../Modal/Modal.module.css';
import { Sponsor } from '@/models/sponsor.model';

export const SponsorProfileTab = ({ newUserData, setNewUserData }: { newUserData: Partial<Sponsor> | null, setNewUserData: React.Dispatch<React.SetStateAction<Partial<Sponsor> | null>>}) => {
  
  const handleFieldChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setNewUserData({...newUserData, [field]: event.currentTarget.value});
  }
  
  return (
    <Box>
      <Box className={styles.box}>
        <Box style={{ flex: 1 }} className={styles.input}>
          <TextInput label="Company" size="md" value={newUserData?.company || ''} onChange={handleFieldChange("company")}/>
          <TextInput label="Specialisation" size="md" value={newUserData?.industry || ''} onChange={handleFieldChange("industry")}/>
          <TextInput label="Website" size="md" value={newUserData?.websiteURL || ''} onChange={handleFieldChange("websiteURL")}/>
        </Box>
        <Box style={{ flex: 1 }} className={styles.input}>
          <TextInput label="Recruiter" size="md" value={newUserData?.name || ''} onChange={handleFieldChange("name")}/>
          <TextInput label="Phone" size="md" value={newUserData?.phoneNumber || ''} onChange={handleFieldChange("phoneNumber")}/>
          <TextInput label="Email" size="md" value={newUserData?.email || ''} onChange={handleFieldChange("email")}/>
        </Box>
      </Box>
    </Box>
  );
};
