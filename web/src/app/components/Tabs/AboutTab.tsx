import { Box, TextInput, Textarea } from '@mantine/core';
import styles from '../Modal/Modal.module.css';
import { Member } from '@/models/member.model';

export const AboutTab = ({ newUserData, setNewUserData }: { newUserData: Partial<Member> | null, setNewUserData: React.Dispatch<React.SetStateAction<Partial<Member> | null>>}) => {
  
  const handleFieldChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setNewUserData({...newUserData, [field]: event.currentTarget.value});
  }
  
  return (
    <Box>
      <Box className={styles.box}>
        <Box style={{ flex: 1 }} className={styles.input}>
          <TextInput value={newUserData?.firstName} onChange={handleFieldChange("firstName")} name="firstName" label="First Name" size="md" />
          <TextInput value={newUserData?.lastName} onChange={handleFieldChange("lastName")} name="lastName" label="Last Name" size="md" />
          <TextInput value={newUserData?.email} onChange={handleFieldChange("email")} name="email" label="Email" size="md" />
        </Box>
        <Box style={{ flex: 1 }} className={styles.input}>
          <TextInput value={newUserData?.phoneNumber} onChange={handleFieldChange("phoneNumber")} name="phoneNumber" label="Phone Number" size="md" />
          <TextInput name="subgroup" label="Subgroup" size="md" />
          <TextInput name="lookingFor" label="Looking For" size="md" />
        </Box>
      </Box>
      <Textarea
        name="aboutMe"
        label="About Me"
        value={newUserData?.desc} 
        onChange={handleFieldChange("desc")}
        size="md"
        classNames={{
          input: styles.area,
        }}
      />
    </Box>
  );
};
