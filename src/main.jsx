import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { createBrowserRouter } from 'react-router-dom'
import { RouterProvider } from 'react-router'
import CreateTrip from './create-trip'
import Header from './components/custom/Header'
import { Toaster } from "sonner";
import { ToastContainer} from 'react-toastify';
import { GoogleOAuthProvider } from '@react-oauth/google';
import Viewtrip from './view-trip'
import MyTrips from './my-trips/index.jsx'

const router = createBrowserRouter([
  {
  path : '/',
  element: <App/>
  },
  {
    path : 'create-trip',
    element: <CreateTrip/>
  },
  {
    path:'view-trip/:tripId',
    element:<Viewtrip/>
  },
  {
    path:'my-trips',
    element:<MyTrips/>
  }
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_AUTH_CLIENT_ID}>
    <Header/>
     <ToastContainer />
    <RouterProvider router={router}/>
    </GoogleOAuthProvider>
  </StrictMode>,
)
