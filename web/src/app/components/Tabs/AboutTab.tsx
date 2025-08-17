import { Box, Select, TextInput, Textarea } from '@mantine/core';
import styles from '../Modal/Modal.module.css';
import { Member } from '@/models/member.model';
import { jobTypeDisplayMap, subGroupDisplayMap } from '@/app/utils/field-display-maps';

const jobTypeOptions = Object.entries(jobTypeDisplayMap).map(([value, label]) => ({
  value,
  label,
}));

const subGroupOptions = Object.entries(subGroupDisplayMap).map(([value, label]) => ({
  value,
  label,
}));

export const AboutTab = ({ newUserData, setNewUserData }: { newUserData: Partial<Member> | null, setNewUserData: React.Dispatch<React.SetStateAction<Partial<Member> | null>>}) => {
  
  const handleInputChange = (field: keyof Member) => (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setNewUserData({...newUserData, [field]: event.currentTarget.value});
  }

  const handleSelectChange = (field: keyof Member) => (value: string | null) => {
    setNewUserData((prev) => ({ ...(prev ?? {}), [field]: value ?? '' }));
  }
  
  return (
    <Box>
      <Box className={styles.box}>
        <Box style={{ flex: 1 }} className={styles.input}>
          <TextInput value={newUserData?.firstName} onChange={handleInputChange("firstName")} label="First Name" size="md" />
          <TextInput value={newUserData?.lastName} onChange={handleInputChange("lastName")} label="Last Name" size="md" />
          <TextInput value={newUserData?.email} onChange={handleInputChange("email")} label="Email" size="md" />
        </Box>
        <Box style={{ flex: 1 }} className={styles.input}>
          <TextInput value={newUserData?.phoneNumber} onChange={handleInputChange("phoneNumber")} label="Phone Number" size="md" />
          <Select value={newUserData?.subGroup} data={subGroupOptions} onChange={handleSelectChange("subGroup")} label="Subgroup" size="md" />
          <Select value={newUserData?.lookingFor} data={jobTypeOptions} onChange={handleSelectChange("lookingFor")} label="Looking for" size="md" />
        </Box>
      </Box>
      <Textarea
        label="About Me"
        value={newUserData?.description} 
        onChange={handleInputChange("description")}
        size="md"
        classNames={{
          input: styles.area,
        }}
      />
    </Box>
  );
};
