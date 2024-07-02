import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { HomePage } from './pages/Home.page';
import { Login } from './pages/Login.page';
import { SignUp } from './pages/Signup.page';
import { StudentProfile } from './pages/StudentProfile.page';
import { SponsorProfile } from './pages/SponsorProfile.page';
import { AlumniProfile } from './pages/AlumniProfile.page';
import { AdminDashboard } from './pages/AdminDashboard.page';
import { JobBoard } from './pages/JobBoard.page';
import { StudentsBoard } from './pages/StudentsBoard.page';
import { SponsorsBoard } from './pages/SponsorsBoard.page';
import { AlumniBoard } from './pages/AlumniBoard.page';
import ProfileSwitcher from './pages/ProfileSwitcher';
import { AppLayout } from './Layouts/AppLayout';
import ProtectedRoute from './components/ProtectedRoute';
import App from './App';
// Protected route is currently commented out. To be enabled once the Authentication Logic has been implemented
const router = createBrowserRouter([
  {
    path: '/',
    element:  <AppLayout><HomePage /></AppLayout>,
  },
  {
    path: '/login',
    element: <AppLayout><Login /></AppLayout>,
  },
  {
    path: '/signup',
    element: <AppLayout><SignUp /></AppLayout>,
  },
  {
    path: '/profile',
    element: <AppLayout><ProfileSwitcher /></AppLayout>,
    children: [
      {
        path: 'student',
        element: (
          //  <ProtectedRoute allowedRoles={['student']}>
          <StudentProfile />
          //</ProtectedRoute>
        ),
      },
      {
        path: 'sponsor',
        element: (
          // <ProtectedRoute allowedRoles={['sponsor']}>
          <SponsorProfile />
          // </ProtectedRoute>
        ),
      },
      {
        path: 'alumni',
        element: (
          // <ProtectedRoute allowedRoles={['alumni']}>
          <AlumniProfile />
          // </ProtectedRoute>
        ),
      },
      {
        path: 'admin',
        element: (
          // <ProtectedRoute allowedRoles={['admin']}>
          <AdminDashboard />
          //  </ProtectedRoute>
        ),
      },
    ],
  },
  {
    path: '/jobs',
    //  <ProtectedRoute allowedRoles={['student', 'admin']}>
    element: <AppLayout><JobBoard /></AppLayout>,
    //  </ProtectedRoute>
  },
  {
    path: '/students',
    //  <ProtectedRoute allowedRoles={['sponsor', 'alumni', 'admin']}>
    element: <AppLayout><StudentsBoard /></AppLayout>,
    //  </ProtectedRoute>
  },
  {
    path: '/sponsors',
    //  <ProtectedRoute allowedRoles={['student', 'admin']}>
    element: <AppLayout><SponsorsBoard /></AppLayout>,
    //  </ProtectedRoute>
  },
  {
    path: '/alumni',
    //  <ProtectedRoute allowedRoles={['student', 'admin']}>
    element: <AppLayout><AlumniBoard /></AppLayout>,
    //  </ProtectedRoute>
  },
]);

export function Router() {
  return <RouterProvider router={router} />;
}
