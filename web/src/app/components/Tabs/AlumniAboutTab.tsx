import { Box, Textarea } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { ChangeEvent, useState } from 'react';
import { Alumni } from '@/models/alumni.model';

const AlumniAboutTab = ({ newUserData, setNewUserData }: { newUserData: Partial<Alumni> | null, setNewUserData: React.Dispatch<React.SetStateAction<Partial<Alumni> | null>>}) => {

  const isMobile = useMediaQuery('(max-width: 430px)'); //mobile screen
  const handleFieldChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setNewUserData({...newUserData, [field]: event.currentTarget.value});
  }

  return (
    <Box>
      {!isMobile ? (
        <Textarea
          px={50}
          minRows={10}
          maxRows={15}
          autosize
          value={newUserData?.description as string} 
          onChange={handleFieldChange("description")}
        ></Textarea>
      ) : (
        <Textarea
          px={10}
          minRows={5}
          maxRows={20}
          autosize
          value={newUserData?.description as string} 
          onChange={handleFieldChange("description")}
        ></Textarea>
      )}
    </Box>
  );
};

export default AlumniAboutTab;
