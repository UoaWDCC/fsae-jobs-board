import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { HomePage } from './pages/General/Home.page';
import { Login } from './pages/General/Login.page';
import { ForgotPassword } from './pages/General/ForgotPassword.page';
import { ResetPassword } from './pages/General/ResetPassword.page';
import { Verify } from './pages/General/Verify.page';
import { ProfileCompletionPage } from './pages/General/ProfileCompletion.page';
import { StudentProfile } from './pages/Student/StudentProfile.page';
import { SponsorProfile } from './pages/Sponsor/SponsorProfile.page';
import { AlumniProfile } from './pages/Alumni/AlumniProfile.page';
import { AdminProfile } from './pages/Admin/AdminProfile.page';
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
import { Role } from './type/role'; 

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
    path: '/complete-profile',
    element: (
      <AppLayout>
        <ProtectedRoute allowedRoles={['member', 'alumni', 'sponsor']}>
          <ProfileCompletionPage />
        </ProtectedRoute>
      </AppLayout>
    ),
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
        path: 'member/:id',
        element: <StudentProfile />,
      },
      {
        path: 'sponsor/:id',
        element: <SponsorProfile />,
      },
      {
        path: 'alumni/:id',
        element: <AlumniProfile />,
      },
      {
        path: 'admin',
        element: <AdminProfile />
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
    path: '/jobs/:id',
    element: (
      <AppLayout>
        <JobDetailsPage />
      </AppLayout>
    ),
  },
  {
    path: '/members',
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
  path: '/admin-dashboard',
  element: (
    <ProtectedRoute allowedRoles={[Role.Admin]}>
      <AppLayout>
        <AdminDashboard />
      </AppLayout>
    </ProtectedRoute>
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
