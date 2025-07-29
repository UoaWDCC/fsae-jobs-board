import { Box, TextInput, Textarea } from '@mantine/core';
import styles from '../Modal/Modal.module.css';
import { Sponsor } from '@/models/sponsor.model';

export const SponsorAboutTab = ({ newUserData, setNewUserData }: { newUserData: Partial<Sponsor> | null, setNewUserData: React.Dispatch<React.SetStateAction<Partial<Sponsor> | null>>}) => {
  const handleFieldChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setNewUserData({...newUserData, [field]: event.currentTarget.value});
  }
  
  return (
    <Box>
      <Textarea
        label="About Me"
        size="md"
        classNames={{
          input: styles.area,
        }}
        value={newUserData?.desc as string} 
        onChange={handleFieldChange("desc")}
      />
    </Box>
  );
};
