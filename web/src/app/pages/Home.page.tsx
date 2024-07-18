import { RootState } from '../../app/store';
import { useSelector } from 'react-redux';
import { Image } from '@mantine/core';
import { StudentGuide } from '../components/Home/Guides';
export function HomePage() {
  const userType = useSelector((state: RootState) => state.user.userType);

  return (
    <>
      <Image src="home_background.jpg"/>
      {userType === 'student' ? <StudentGuide /> : null}
      
    </>
  );
}
