import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { HomePage } from './pages/General/Home.page';
import { Login } from './pages/General/Login.page';
import { ForgotPassword } from './pages/General/ForgotPassword.page';
import { ResetPassword } from './pages/General/ResetPassword.page';
import { Verify } from './pages/General/Verify.page';
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

import { JobDetailsPage } from './pages/General/JobDetails.page'; 

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
    path: '/forgot-password',
    element: (
      <AppLayout>
        <ForgotPassword />
      </AppLayout>
    ),
  },
  {
    path: '/reset-password',
    element: (
      <AppLayout>
        <ResetPassword />
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
        path: 'member',
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
        path: '*',
        element: <NotFound />,
      },
    ],
  },
  {
    path: '/verify',
    element: (
      <AppLayout>
        <Verify />
      </AppLayout>
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
        path: 'member',
        element: <StudentProfile />,
      },
      {
        path: 'sponsor',
        element: <SponsorProfile />,
      },
      {
        path: 'alumni',
        element: <AlumniProfile />,
      },
      {
        path: 'admin',
        element: <AdminDashboard />,
      },
      {
        path: '*',
        element: <NotFound />,
      },
    ],
  },
  {
    path: '/jobs',
    element: (
      <AppLayout>
        <JobBoard />
      </AppLayout>
    ),
  },
  {
    path: '/jobs/:id', // ✅ NEW clean dynamic route for job detail
    element: (
      <AppLayout>
        <JobDetailsPage />
      </AppLayout>
    ),
  },
  {
    path: '/students',
    element: (
      <AppLayout>
        <StudentsBoard />
      </AppLayout>
    ),
  },
  {
    path: '/sponsors',
    element: (
      <AppLayout>
        <SponsorsBoard />
      </AppLayout>
    ),
  },
  {
    path: '/alumni',
    element: (
      <AppLayout>
        <AlumniBoard />
      </AppLayout>
    ),
  },
  {
    path: '*',
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
