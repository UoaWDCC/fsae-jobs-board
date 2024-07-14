import { createBrowserRouter } from 'react-router-dom';
import { HomePage } from './pages/Home.page';
import { Login } from './pages/Login.page';
import { StudentSignUp } from './pages/StudentSignup.page';
import { SponsorSignUp } from './pages/SponsorSignup.page';
import { AlumniSignUp } from './pages/AlumniSignup.page';
import { AdminSignUp } from './pages/AdminSignup.page';
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
import ProtectedRoute from './components/ProtectedRoute';
import SignupSwitcher from './pages/SignupSwitcher.page';
// Protected route is currently commented out. To be enabled once the Authentication Logic has been implemented
const AppRoutes = createBrowserRouter([
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
    element: <SignupSwitcher />,
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
        path: 'admin',
        element: <AdminSignUp />,
      },
    ],
  },

  {
    path: '/profile',
    element: <ProfileSwitcher />,
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
        path: '*',
        element: <NotFound />,
      },
    ],
  },
  {
    path: '/jobs',
    //  <ProtectedRoute allowedRoles={['student', 'admin']}>
    element: <JobBoard />,
    //  </ProtectedRoute>
  },
  {
    path: '/students',
    //  <ProtectedRoute allowedRoles={['sponsor', 'alumni', 'admin']}>
    element: <StudentsBoard />,
    //  </ProtectedRoute>
  },
  {
    path: '/sponsors',
    //  <ProtectedRoute allowedRoles={['student', 'admin']}>
    element: <SponsorsBoard />,
    //  </ProtectedRoute>
  },
  {
    path: '/alumni',
    //  <ProtectedRoute allowedRoles={['student', 'admin']}>
    element: <AlumniBoard />,
    //  </ProtectedRoute>
  },
  {
    path: '*',
    element: <NotFound />,
  },
]);

export default AppRoutes;
