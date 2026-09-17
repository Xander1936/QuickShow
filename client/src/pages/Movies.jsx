// IMPORTANT: This module is part of the QuickShow application. It contains the core UI or server logic for this feature and should remain behaviorally identical while editing.

// import  {  dummyShowsData  }  from  '../assets/assets'
import MoviesCard from '../components/MoviesCard'
import BlurCircle from '../components/BlurCircle'
import { useAppContext } from '../context/AppContext'

// Movies page component. It renders the listing view for the '/movies' route.
const Movies = () => {

  const { shows } = useAppContext()

  return shows.length > 0 ? (
    <div className='relative my-40 mb-60 px-6 md:px-16 lg:px-40 xl:px-44 
      overflow-hidden min-h-[80vh]' 
    > 

      <BlurCircle top="150px" left="0px" /> 
      <BlurCircle bottom="50px" right="0px" /> 

      <h1 className='text-lg font-medium my-4'>Now Showing</h1>
      <div className='flex flex-wrap max-md:flex-col max-md:items-center md:justify-center gap-8'>
        {shows.map((movie) => (
          <MoviesCard key={movie._id} movie={movie} />
        ))}
      </div>
    </div>
  ) : (
    <div  className='flex flex-col items-center justify-center h-screen'>
      <h1 className='text-3xl font-bold text-center' >No movies available</h1>
    </div>
  )
}

export default Movies
