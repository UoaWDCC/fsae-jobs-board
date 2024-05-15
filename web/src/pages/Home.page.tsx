import { Welcome } from '../components/Welcome/Welcome';
import { ColorSchemeToggle } from '../components/ColorSchemeToggle/ColorSchemeToggle';
import Navbar from '@components/Navbar';

export function HomePage() {
  return (
    <>
      <Navbar />
      <Welcome />
      <ColorSchemeToggle />
    </>
  );
}
