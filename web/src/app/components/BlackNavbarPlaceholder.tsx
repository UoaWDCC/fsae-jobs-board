import { Box } from '@mantine/core';

const BlackNavbarPlaceholder = () => {
  return (
    <Box
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        backgroundColor: 'black',
        padding: '1rem',
        width: '100%',
        height: '12vh',
      }}
    ></Box>
  );
};

export default BlackNavbarPlaceholder;
