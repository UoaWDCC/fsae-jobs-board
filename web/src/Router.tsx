import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { HomePage } from './pages/Home.page';
import {Login} from './pages/Login.page';
import { SignUp } from './pages/Signup.page';

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
  }
]);

export function Router() {
  return <RouterProvider router={router} />;
}
