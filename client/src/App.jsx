import Navbar from './components/Navbar'
import Footer from './components/Footer'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import Home from './pages/Home'
import Movies from './pages/Movies'
import MovieDetails from './pages/MovieDetails'
import SeatLayout from './pages/SeatLayout'
import MyBookings from './pages/MyBookings'
import Favorite from './pages/Favorite'
import Dashboard from './pages/admin/Dashboard'
import AddShows from './pages/admin/AddShows'
import ListShows from './pages/admin/ListShows'
import ListBookings from './pages/admin/ListBookings'
import Layout from './pages/admin/Layout'
import { SignIn } from '@clerk/react'
import { Toaster } from 'react-hot-toast'
import { useAppContext } from './context/AppContext'
// import './App.css'


// Main application shell: renders the shared layout and the active route.
const App = () => {
  // Hide the shared navbar/footer on admin pages if needed.
  // const location = useLocation()
  const isAdminRoute = useLocation().pathname.startsWith('/admin')

  const { user, isAdmin } = useAppContext();

  return (
    <>
      <Toaster />
      {!isAdminRoute && <Navbar />}
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/movies' element={<Movies />} />
        <Route path='/movies/:id' element={<MovieDetails />} />
        <Route path='/movies/:id/:date' element={<SeatLayout />} />
        <Route path='/my-bookings' element={<MyBookings />} />
        <Route path='/favorite' element={<Favorite />} />

        <Route path='/admin/*' element={
          !user ? (
            <div className='min-h-screen flex justify-center items-center'>
              <SignIn fallbackRedirect={'/admin'} />
            </div>
          ) : isAdmin === null ? (
            <div className='min-h-screen flex justify-center items-center'>
              Loading...
            </div>
          ) : isAdmin ? (
            <Layout />
          ) : (
            <Navigate to='/' replace />
          )
        }>
          <Route index element={<Dashboard/>} />
          <Route path="add-shows" element={<AddShows/>} />
          <Route path="list-shows" element={<ListShows/>} />
          <Route path="list-bookings" element={<ListBookings />} />
        </Route>
      </Routes>
      {!isAdminRoute && <Footer />}
    </>
  )
}

export default App