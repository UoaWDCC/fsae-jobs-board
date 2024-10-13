import { Box, Textarea } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { ChangeEvent, useState } from 'react';

interface UserData {
  description: string;
}

interface AlumniAboutTabProps {
  userData: UserData;
}

const AlumniAboutTab = ({ userData }: AlumniAboutTabProps) => {
  const [formData, setFormData] = useState<UserData>({
    description: userData.description || '',
  });

  const handleInputChange =
    (field: keyof UserData) => (event: ChangeEvent<HTMLTextAreaElement>) => {
      setFormData({
        ...formData,
        [field]: event.currentTarget.value,
      });
    };
  const isMobile = useMediaQuery('(max-width: 430px)'); //mobile screen

  return (
    <Box>
      {!isMobile ? (
        <Textarea
          px={50}
          minRows={10}
          maxRows={15}
          autosize
          value={formData.description}
          onChange={handleInputChange('description')}
        ></Textarea>
      ) : (
        <Textarea
          px={10}
          minRows={5}
          maxRows={20}
          autosize
          value={formData.description}
          onChange={handleInputChange('description')}
        ></Textarea>
      )}
    </Box>
  );
};

export default AlumniAboutTab;
