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
import ProtectedRoute from './components/ProtectedRoute';
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
      {
        path: 'student',
        element: (
          <ProtectedRoute allowedRoles={['student']}>
            <StudentProfile />
          </ProtectedRoute>
        ),
      },
      {
        path: 'sponsor',
        element: (
          <ProtectedRoute allowedRoles={['sponsor']}>
            <SponsorProfile />
          </ProtectedRoute>
        ),
      },
      {
        path: 'alumni',
        element: (
          <ProtectedRoute allowedRoles={['alumni']}>
            <AlumniProfile />
          </ProtectedRoute>
        ),
      },
      {
        path: 'admin',
        element: (
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminDashboard />
          </ProtectedRoute>
        ),
      },
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
