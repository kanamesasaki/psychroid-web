import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import './index.css'
import App from './App.tsx'
import GuideLayout from './components/guide/GuideLayout'
import Introduction from './components/guide/Introduction'
import BasicProcess from './components/guide/BasicProcess.tsx'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
  },
  {
    path: '/guide',
    element: <GuideLayout />,
    children: [
      {
        index: true,
        element: <Introduction />,
      },
      {
        path: 'basics',
        element: <BasicProcess />,
      },
    ],
  },
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HelmetProvider>
      <RouterProvider router={router} />
    </HelmetProvider>
  </StrictMode>,
)