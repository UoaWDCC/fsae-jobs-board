import { useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar/Navbar';

export function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main style={{ paddingTop: '80px' }}>
        {children}
      </main>
    </>
  );
}
