import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { HomePage } from './pages/Home.page';
import { Login } from './pages/Login.page';
import { SignUp } from './pages/Signup.page';
import { StudentProfile } from './pages/StudentProfile';
import { SponsorProfile } from './pages/SponsorProfile';
import { AlumniProfile } from './pages/AlumniProfile';
import { AdminDashboard } from './pages/AdminDashboard';
import { JobBoard } from './pages/JobBoard';
import { StudentsBoard } from './pages/StudentsBoard';
import { SponsorsBoard } from './pages/SponsorsBoard';
import { AlumniBoard } from './pages/AlumniBoard';
import ProfileSwitcher from './pages/ProfileSwitcher';

const router = createBrowserRouter([
  {
    path: '/',
    element: <HomePage />,
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/signup',
    element: <SignUp />,
  },
  {
    path: '/profile',
    element: <ProfileSwitcher />,
    children: [
      { path: 'student', element: <StudentProfile /> },
      { path: 'sponsor', element: <SponsorProfile /> },
      { path: 'alumni', element: <AlumniProfile /> },
      { path: 'admin', element: <AdminDashboard /> },
      { path: '', element: <Navigate to="/profile/student" /> }, // Default
    ],
  },
  {
    path: '/jobs',
    element: <JobBoard />,
  },
  {
    path: '/students',
    element: <StudentsBoard />,
  },
  {
    path: '/sponsors',
    element: <SponsorsBoard />,
  },
  {
    path: '/alumni',
    element: <AlumniBoard />,
  },
]);

export function Router() {
  return <RouterProvider router={router} />;
}
