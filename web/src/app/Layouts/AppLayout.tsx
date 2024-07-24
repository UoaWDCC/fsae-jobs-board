import { useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar/Navbar';

export function AppLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation();

  return (
    <div>
      <Navbar />

      <main
        style={{
          paddingTop: '3rem',
          flex: 1,
          width: '100vw',
          height: '100vh',
        }}
      >
        {children}
      </main>
    </div>
  );
}
