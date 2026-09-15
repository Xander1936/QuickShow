import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { dummyDateTimeData } from '../assets/assets'
import timeFormat from '../lib/timeFormat'
import { Heart, PlayCircleIcon, StarIcon } from 'lucide-react'
import DateSelect from '../components/DateSelect'
import MovieCard from '../components/MoviesCard'
import Loading from '../components/Loading'
import { useAppContext } from '../context/AppContext'
import toast from 'react-hot-toast'


// Base URL for TMDB profile images (https://www.themoviedb.org/settings/api)
const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w185'
const TMDB_API_BASE_URL = 'https://api.themoviedb.org/3'

// Details view for a movie, including cast, showtimes, and related titles.
const MovieDetails = () => {

  const navigate = useNavigate()
  const { id } = useParams()
  const [show, setShow] = useState(null)
  const [casts, setCasts] = useState([])

  const { shows, axios, getToken, user, fetchFavoriteMovies, favoriteMovies, image_base_url } = useAppContext()
  const isFavorite = favoriteMovies.some((movie) => movie._id === id)

  const getShow = async () => {
    const selectedShow = shows.find((show) => show._id === id)
    if (selectedShow) {
      setShow({
        movie: selectedShow,
        dateTime: dummyDateTimeData
      })
    }
  }

  // Fetch the cast list (name + profile image) directly from the TMDB API,
  // instead of relying on cast.name / image_base_url coming from our own backend.
  // Our own movie documents are identified by their internal _id (e.g. a Mongo id),
  // which is not necessarily the TMDB movie id, so we look for a stored `tmdb_id`
  // on the movie and fall back to the movie's own _id if it isn't set.
  const getCasts = async () => {
    try {
      const apiKey = import.meta.env.VITE_TMDB_API_KEY
      const tmdbMovieId = show?.movie?.tmdb_id ?? show?.movie?._id
      if (!apiKey || !tmdbMovieId) return

      const { data } = await axios.get(
        `${TMDB_API_BASE_URL}/movie/${tmdbMovieId}/credits`,
        { params: { api_key: apiKey, language: 'en-US' } }
      )

      setCasts(data.cast || [])
    } catch (error) {
      console.log(error)
    }
  }

  const handleFavorite = async () => {
    try {
      if(!user) return toast.error("Please login to proceed");
      const isAddingFavorite = !favoriteMovies.find(movie => movie._id === id)

      const { data } = await axios.post(
        '/api/user/update-favorite', 
        {movieId: id},
        {headers: { Authorization: `Bearer ${await getToken()}` }}
      )

      if(data.success){
        await fetchFavoriteMovies()
        if (isAddingFavorite) toast.success('Favorite movies updated')
      }
    } catch (error) {
      console.log(error);
      
    }
  }

  useEffect(() => {
    getShow()
  }, [id, shows])

  useEffect(() => {
    getCasts()
  }, [show])

  return show ? (
    <div className='px-6 md:px-16 lg:px-40 pt-30 md:pt-50' >
      <div className='flex flex-col md:flex-row gap-8 max-w-6xl mx-auto'>

        <img 
          src={image_base_url + show.movie.poster_path}
          className='max-md:mx-auto rounded-xl h-104 max-w-70 object-cover' 
          alt="" 
        />

        <div className='relative flex flex-col gap-3'>
          <p>ENGLISH</p>
          <h1 
            className='text-4xl font-semibold max-w-96 text-balance'>
            {show.movie.title}
          </h1>

          <div className='flex items-center gap-2 text-gray-300'>
            <StarIcon className="w-5 h-5 text-primary fill-primary"/>
            {show.movie.vote_average.toFixed(1)} User Rating
          </div>
          <p className='text-gray-400 mt-2 text-sm leading-tight max-w-xl'> 
            {show.movie.overview} 
          </p>

          <p>
            {timeFormat(show.movie.runtime)} . {show.movie.genres.map(genre=> 
              genre.name).join(" | ")} . {show.movie.release_date.split("-")[0]}
          </p>

          <div className='flex items-center flex-wrap gap-4 mt-4' >
            <button className='flex items-center gap-2 px-7 py-3 text-sm 
            bg-gray-800 hover:bg-gray-900 transition rounded-md font-medium 
            cursor-pointer active:scale-95'
            >
              <PlayCircleIcon className='w-5 h-5'/>
              Watch Trailer
            </button>
            <a href="#dateSelect" className='px-10 py-3 text-sm bg-primary 
            hover:bg-primary-dull transition rounded-md font-medium cursor-pointer 
            active:scale-95'
            >
              Buy Tickets
            </a>
            <button
              // onClick={() => setIsFavorite((favorite) => !favorite)}
              onClick={handleFavorite}
              aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
              className='bg-gray-700 p-2.5 rounded-full transition 
            cursor-pointer active:scale-95'>
              <Heart className={`w-5 h-5 ${favoriteMovies.find(movie => movie._id === id) ? 'fill-primary text-primary' : ''}`}/>
            </button>
          </div>
        </div>   
      </div>

      <p className='text-lg font-medium mt-20'>Your Favorite  Cast</p>
      <div className='overflow-x-auto no-scrollbar mt-8 pb-4'>
        <div className='flex items-center gap-4 w-max px-4'>
          {casts.slice(0,12).map((cast, index)=> (
            <div key={cast.cast_id ?? cast.credit_id ?? `${cast.name}-${index}`} className='flex flex-col items-center text-center'>
              <img 
                src={
                  cast.profile_path
                    ? `${TMDB_IMAGE_BASE_URL}${cast.profile_path}`
                    : '/no-profile.png'
                }
                alt={cast.name || 'Cast member'}
                className='rounded-full h-20 md:h-20 aspect-square object-cover'
              />
              <p className='font-medium text-xs mt-3'>{cast.name}</p>
            </div>
          ))}
        </div>
      </div>

      <DateSelect dateTime={show.dateTime} id={id} />

      <p className='text-lg font-medium mt-20 mb-8' >You May Also Like</p>
      <div className='flex flex-wrap max-md:flex-col max-md:items-center md:justify-center gap-8' >
        {shows.slice(0,8).map((movie, index)=> (
          <MovieCard key={index} movie={movie} />
        ))}
      </div>
      <div className='flex justify-center mt-20'>
        <button
          onClick={()=> {navigate('/movies'); scrollTo(0,0)}} 
          className='px-10 py-3 text-sm bg-primary hover:bg-primary-dull 
          transition rounded-md font-medium cursor-pointer '
        >
          Show more
        </button>
      </div>

    </div>
  ) : <Loading/>
}

export default MovieDetails
