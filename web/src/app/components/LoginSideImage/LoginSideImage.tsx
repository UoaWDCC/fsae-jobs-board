import { BackgroundImage, Box } from '@mantine/core';
import classes from './LoginSideImage.module.css';

export function LoginSideImage() {
  return (
    <Box className={classes.imageContainer}>
      <BackgroundImage className={classes.imageContainer} src="loginImg.png" />
    </Box>
  );
}
