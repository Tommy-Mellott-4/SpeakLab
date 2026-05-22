import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Layout from '@/components/Layout'
import Onboarding from '@/pages/Onboarding'
import Dashboard from '@/pages/Dashboard'
import Challenge from '@/pages/Challenge'
import Session from '@/pages/Session'
import History from '@/pages/History'

const router = createBrowserRouter([
  {
    path: '/onboarding',
    element: <Onboarding />,
  },
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <Dashboard /> },
      { path: 'challenge', element: <Challenge /> },
      { path: 'session', element: <Session /> },
      { path: 'history', element: <History /> },
    ],
  },
])

export default function App() {
  return <RouterProvider router={router} />
}
