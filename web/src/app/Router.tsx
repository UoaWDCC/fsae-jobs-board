import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { HomePage } from './pages/Home.page';
import { Login } from './pages/Login.page';
import { Verify } from './pages/Verify.page';
import { StudentProfile } from './pages/StudentProfile.page';
import { SponsorProfile } from './pages/SponsorProfile.page';
import { AlumniProfile } from './pages/AlumniProfile.page';
import { AdminDashboard } from './pages/AdminDashboard.page';
import { JobBoard } from './pages/JobBoard.page';
import { StudentsBoard } from './pages/StudentsBoard.page';
import { SponsorsBoard } from './pages/SponsorsBoard.page';
import { AlumniBoard } from './pages/AlumniBoard.page';
import { NotFound } from './pages/NotFound.page';
import ProfileSwitcher from './pages/ProfileSwitcher';
import { AppLayout } from './Layouts/AppLayout';
import ProtectedRoute from './components/ProtectedRoute';
import { StudentSignUp } from './pages/StudentSignup.page';
import { SponsorSignUp } from './pages/SponsorSignup.page';
import { AlumniSignUp } from './pages/AlumniSignup.page';
import { AdminSignUp } from './pages/AdminSignup.page';
import SignupSwitcher from './pages/SignupSwitcher.page';

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
    path: '/verify',
    element: (
      <Verify />
    ),
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
