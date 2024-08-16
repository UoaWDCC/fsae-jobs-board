import { BackgroundImage, Box } from '@mantine/core';
import styles from './LoginSideImage.module.css';

export function LoginSideImage() {
  return (
    <Box className={styles.imageContainer}>
      <BackgroundImage className={styles.imageContainer} src="loginImg.png" />
    </Box>
  );
}
