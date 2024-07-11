import { Welcome } from '../components/Welcome/Welcome';
import { ColorSchemeToggle } from '../components/ColorSchemeToggle/ColorSchemeToggle';
import {Image} from '@mantine/core'

export function HomePage() {
  return (
    <>
      <Image src="home_background.jpg" fit="cover" />
      {/* <Welcome /> */}
      {/* <ColorSchemeToggle /> */}
    </>
  );
}
