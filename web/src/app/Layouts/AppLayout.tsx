import { useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar/Navbar';

export function AppLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation();

  return (
    <div>
      {!location.pathname.includes('login') && !location.pathname.includes('signup') && <Navbar />}

      <main>{children}</main>
    </div>
  );
}
