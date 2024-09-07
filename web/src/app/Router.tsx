import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { HomePage } from './pages/General/Home.page';
import { Login } from './pages/General/Login.page';
import { StudentProfile } from './pages/Student/StudentProfile.page';
import { SponsorProfile } from './pages/Sponsor/SponsorProfile.page';
import { AlumniProfile } from './pages/Alumni/AlumniProfile.page';
import { AdminDashboard } from './pages/Admin/AdminDashboard.page';
import { JobBoard } from './pages/Student/JobBoard.page';
import { StudentsBoard } from './pages/Student/StudentsBoard.page';
import { SponsorsBoard } from './pages/Sponsor/SponsorsBoard.page';
import { AlumniBoard } from './pages/Alumni/AlumniBoard.page';
import { NotFound } from './pages/General/NotFound.page';
import ProfileSwitcher from './pages/General/ProfileSwitcher';
import { AppLayout } from './Layouts/AppLayout';
import ProtectedRoute from './components/ProtectedRoute';
import { StudentSignUp } from './pages/Student/StudentSignup.page';
import { SponsorSignUp } from './pages/Sponsor/SponsorSignup.page';
import { AlumniSignUp } from './pages/Alumni/AlumniSignup.page';
import { AdminSignUp } from './pages/Admin/AdminSignup.page';
import SignupSwitcher from './pages/General/SignupSwitcher.page';
import { AdminLogin } from './pages/Admin/AdminLogin.page';

// Protected route is currently commented out. To be enabled once the Authentication Logic has been implemented
const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <AppLayout>
        <HomePage />
      </AppLayout>
    ),
  },
  {
    path: '/login',
    element: (
      <AppLayout>
        <Login />
      </AppLayout>
    ),
  },
  {
    path: '/fsae-administrator-login',
    element: (
      <AppLayout>
        <AdminLogin />
      </AppLayout>
    ),
  },
  {
    path: '/signup',
    element: (
      <AppLayout>
        <SignupSwitcher />
      </AppLayout>
    ),
    children: [
      {
        path: 'student',
        element: <StudentSignUp />,
      },
      {
        path: 'sponsor',
        element: <SponsorSignUp />,
      },
      {
        path: 'alumni',
        element: <AlumniSignUp />,
      },
      {
        path: '*', // Catch-all for unmatched paths under /signup
        element: <NotFound />,
      },
    ],
  },
  {
    path: '/profile',
    element: (
      <AppLayout>
        <ProfileSwitcher />
      </AppLayout>
    ),
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
      {
        path: '*', // Catch-all for unmatched paths under /profile
        element: <NotFound />,
      },
    ],
  },
  {
    path: '/jobs',

    element: (
      // <ProtectedRoute allowedRoles={['student', 'admin']}>
      <AppLayout>
        <JobBoard />
      </AppLayout>
      // </ProtectedRoute>
    ),
  },
  {
    path: '/students',

    element: (
      // <ProtectedRoute allowedRoles={['sponsor', 'alumni', 'admin']}>
      <AppLayout>
        <StudentsBoard />
      </AppLayout>
      //</ProtectedRoute>
    ),
  },
  {
    path: '/sponsors',
    element: (
      //<ProtectedRoute allowedRoles={['student', 'admin']}>
      <AppLayout>
        <SponsorsBoard />
      </AppLayout>
      //</ProtectedRoute>
    ),
  },
  {
    path: '/alumni',

    element: (
      //<ProtectedRoute allowedRoles={['student', 'admin']}>
      <AppLayout>
        <AlumniBoard />
      </AppLayout>
      // </ProtectedRoute>
    ),
  },
  {
    path: '*', // Catch-all undefined routes
    element: (
      <AppLayout>
        <NotFound />
      </AppLayout>
    ),
  },
]);

export function Router() {
  return <RouterProvider router={router} />;
}
