// IMPORTANT: This module is part of the QuickShow application. It contains the core UI or server logic for this feature and should remain behaviorally identical while editing.

import { useEffect, useState } from 'react'
import { dummyBookingData } from '../assets/assets'
import BlurCircle from '../components/BlurCircle'
import Loading from '../components/Loading'
import timeFormat from '../lib/timeFormat'
import { dateFormat } from '../lib/dateFormat'
import { useAppContext } from '../context/AppContext'
import { SignIn } from '@clerk/react'

// Displays the current user's booked movies and ticket information.
const MyBookings = () => {
  const currency = import.meta.env.VITE_CURRENCY

  const { axios, getToken, user, isLoaded, image_base_url } = useAppContext()
  const sessionId = new URLSearchParams(window.location.search).get('session_id')

  const [bookings, setBookings] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  const payBooking = async (bookingId) => {
    try {
      const { data } = await axios.post(
        '/api/booking/payment-session',
        { bookingId },
        {
          headers: {
            Authorization: `Bearer ${await getToken()}`
          }
        }
      )

      if (data.success) {
        window.location.href = data.url
      } else {
        console.error(data.message)
      }
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    if (!isLoaded) return
    if (!user) {
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    let isCancelled = false

    const fetchBookings = async () => {
      try {
        const { data } = await axios.get('/api/user/bookings', {
          headers: { Authorization: `Bearer ${await getToken()}` }
        })
        if (data.success) {
          if (!isCancelled) setBookings(data.bookings)
          return data.bookings
        }
      } catch (error) {
        console.log(error)
      } finally {
        if (!isCancelled) setIsLoading(false)
      }
      return []
    }

    const loadBookings = async () => {
      const initialBookings = await fetchBookings()
      if (!sessionId || isCancelled) return

      const previouslyPaid = new Set(
        initialBookings.filter(booking => booking.isPaid).map(booking => booking._id)
      )

      for (let attempt = 0; attempt < 10; attempt++) {
        await new Promise(resolve => setTimeout(resolve, 1000))
        if (isCancelled) return

        const updatedBookings = await fetchBookings()
        if (updatedBookings.some(
          booking => booking.isPaid && !previouslyPaid.has(booking._id)
        )) return
      }
    }

    loadBookings()
    return () => {
      isCancelled = true
    }
  }, [axios, getToken, isLoaded, sessionId, user])

  if (!isLoaded) return <Loading />

  if (!user) {
    return (
      <div className='min-h-[80vh] flex items-center justify-center'>
        <SignIn fallbackRedirect={`/my-bookings${window.location.search}`} />
      </div>
    )
  }

  return !isLoading ? (
    <div className='relative px-6 md:px-16 lg:px-40 pt-30 md:pt-40 min-h-[80vh]'>
      <BlurCircle top="100px" left="100px" />
      <div>
        <BlurCircle bottom="0px" left="600px" />
      </div>
      <h1 className='text-lg font-semibold mb-4'>My Bookings</h1>

      {bookings.map((item, index)=> (
        <div
          key={index}
          className='flex flex-col md:flex-row justify-between 
          bg-primary/8 border border-primary/20 rounded-lg mt-4 p-2 max-w-3xl'
        >
          <div className='flex flex-col md:flex-row'>
            <img 
              src={image_base_url + item.show.movie.poster_path} 
              alt="" 
              className='md:max-w-45 aspect-video h-auto object-cover object-bottom rounded'
            />
            <div className='flex flex-col p-4'>
              <p className='text-lg font-semibold'>{item.show.movie.title}</p>
              <p className='text-gray-400 text-sm'>{timeFormat(item.show.movie.runtime)}</p>
              <p className='text-gray-400 text-sm mt-auto'>{dateFormat(item.show.showDateTime)}</p>
            </div>
          </div>

          <div
            className='flex flex-col md:items-end md:text-right justify-between p-4'
          >
            <div className='flex items-center gap-4'>
              <p className='text-2xl font-semibold mb-3'> {currency}{item.amount} </p>
              {!item.isPaid && 
                <button 
                  onClick={() => payBooking(item._id)}
                  className='bg-primary px-4 py-1.5 mb-3 text-sm rounded-full font-medium cursor-pointer'
                >
                  Pay Now
                </button>
              }
            </div>
            <div className='text-sm'>
              <p><span className='text-gray-400'>Total Tickets:</span> {item.bookedSeats.length}.</p>
              <p><span className='text-gray-400'>Seat Number:</span> {item.bookedSeats.join(", ")}.</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  ) : <Loading />
}

export default MyBookings
