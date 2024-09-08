import { useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar/Navbar';
import { ScrollProvider } from '../contexts/ScrollContext'; // Adjust the path as needed

export function AppLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation();

  return (
    <ScrollProvider>
      <div>
        <Navbar />

        <main>{children}</main>
      </div>
    </ScrollProvider>
  );
}
