import { Box, Avatar, Text, Flex } from '@mantine/core';

interface StudentListingProp {}

const StudentListing: FC<StudentListingProp> = ({}) => {
  const studentList = [
    {
      name: 'John Doe1',
      role: 'Student',
      title: 'Graduate Mechatronics Engineer',
      avatar:
        'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-9.png',
    },
    {
      name: 'John Doe2',
      role: 'Student',
      title: 'Graduate Mechatronics Engineer',
      avatar:
        'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-9.png',
    },
    {
      name: 'John Doe3',
      role: 'Student',
      title: 'Graduate Mechatronics Engineer',
      avatar:
        'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-9.png',
    },
    {
      name: 'John Doe4',
      role: 'Student',
      title: 'Graduate Mechatronics Engineer',
      avatar:
        'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-9.png',
    },
  ];

  const Student: FC<(typeof studentList)[0]> = ({ name, role, title, avatar }) => (
    <Flex direction="row" align="center" gap="md">
      <Avatar src={avatar} alt={name} />
      <Box>
        <Text>{name}</Text>
        <Text>{role}</Text>
        <Text>{title}</Text>
      </Box>
    </Flex>
  );

  return (
    <Flex justify="flex-start" align="flex-start" direction="column" gap="md">
      {studentList.map((student, index) => (
        <Box key={index}>
          <Student
            name={student.name}
            role={student.role}
            title={student.title}
            avatar={student.avatar}
          />
        </Box>
      ))}
    </Flex>
  );
};

export default StudentListing;
