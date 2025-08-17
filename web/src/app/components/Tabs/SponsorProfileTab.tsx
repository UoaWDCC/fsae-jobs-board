import { Box, TextInput } from '@mantine/core';
import styles from '../Modal/Modal.module.css';
import { Sponsor } from '@/models/sponsor.model';

export const SponsorProfileTab = ({ newUserData, setNewUserData }: { newUserData: Partial<Sponsor> | null, setNewUserData: React.Dispatch<React.SetStateAction<Partial<Sponsor> | null>>}) => {
  
  const handleInputChange = (field: keyof Sponsor) => (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setNewUserData({...newUserData, [field]: event.currentTarget.value});
    }
  
  return (
    <Box>
      <Box className={styles.box}>
        <Box style={{ flex: 1 }} className={styles.input}>
          <TextInput label="Company" size="md" value={newUserData?.companyName as string} onChange={handleInputChange("companyName")}/>
          <TextInput label="Industry" size="md" value={newUserData?.industry as string} onChange={handleInputChange("industry")} />
          <TextInput label="Website" size="md" value={newUserData?.websiteURL as string} onChange={handleInputChange("websiteURL")}/>
        </Box>
        <Box style={{ flex: 1 }} className={styles.input}>
          <TextInput label="Phone" size="md" value={newUserData?.phoneNumber as string} onChange={handleInputChange("phoneNumber")}/>
          <TextInput label="Email" size="md" value={newUserData?.email as string} onChange={handleInputChange("email")}/>
        </Box>
      </Box>
    </Box>
  );
};
