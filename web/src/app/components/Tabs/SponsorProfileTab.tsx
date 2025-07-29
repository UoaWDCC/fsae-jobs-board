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
          <TextInput label="Company" size="md" value={newUserData?.company as string} onChange={handleFieldChange("company")}/>
          <TextInput label="Specialisation" size="md" />
          <TextInput label="Website" size="md" value={newUserData?.websiteURL as string} onChange={handleFieldChange("websiteURL")}/>
        </Box>
        <Box style={{ flex: 1 }} className={styles.input}>
          <TextInput label="Recruiter" size="md" />
          <TextInput label="Phone" size="md" value={newUserData?.phoneNumber as string} onChange={handleFieldChange("phoneNumber")}/>
          <TextInput label="Email" size="md" value={newUserData?.email as string} onChange={handleFieldChange("email")}/>
        </Box>
      </Box>
    </Box>
  );
};
