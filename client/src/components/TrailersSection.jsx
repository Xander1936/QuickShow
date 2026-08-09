import React, { useState } from 'react'
import { dummyTrailers } from '../assets/assets'
import ReactPlayer from 'react-player'
import { PlayCircleIcon } from 'lucide-react'
import BlurCircle from './BlurCircle'

const TrailersSection = () => {

  const [currentTrailer, setCurrentTrailer] = useState(dummyTrailers[0])
  const [isPlaying, setIsPlaying] = useState(false)

  const handleSelectTrailer = (trailer) => {
    setCurrentTrailer(trailer)
    setIsPlaying(false)
  }

  return (
    <div className='px-6 md:px-16 lg:px-24 xl:px-44 py-20 overflow-hidden'>
      <p className='text-gray-300 font-medium text-lg max-w-[960px] mx-auto'>
        Trailers
      </p>

      <div className='relative mt-6'>
        <BlurCircle top='-100px' right='-100px' />

        <div
          className='relative mx-auto'
          style={{ maxWidth: '960px', width: '100%', aspectRatio: '16 / 9' }}
        >
          {/* ReactPlayer component to play the selected trailer */}
          <ReactPlayer
            src={currentTrailer.videoUrl}
            playing={isPlaying}
            controls={isPlaying}
            width='100%'
            height='100%'
          />
          {/* Overlay play button when not playing */}
          {!isPlaying && (
            <button
              onClick={() => setIsPlaying(true)}
              className='absolute inset-0 flex items-center justify-center bg-black/20 cursor-pointer'
            >
              <PlayCircleIcon className='w-16 h-16 md:w-20 md:h-20 text-white' strokeWidth={1.5} />
            </button>
          )}
        </div>
        {/* Thumbnail selection */}
        <div className='group grid grid-cols-4 gap-4 md:gap-8 mt-8 max-w-3xl mx-auto'>
          {dummyTrailers.map((trailer) => (
            <div 
                key={trailer.image} 
                className='relative group-hover:not-hover:opacity-50 hover:-translate-y-1 duration-300 transition max-md:h-60 cursor-pointer'
                onClick={() => setCurrentTrailer(trailer)}
            >
                <img
                    key={trailer.videoUrl}
                    src={trailer.image}
                    alt="trailer"
                    onClick={() => handleSelectTrailer(trailer)}
                    className={`h-14 md:h-20 w-auto object-cover rounded-lg cursor-pointer transition
                    ${currentTrailer.videoUrl === trailer.videoUrl ? 'ring-2 ring-primary' : 'opacity-60 hover:opacity-100'}`}
                />
                <PlayCircleIcon 
                    strokeWidth={1.6} 
                    className="absolute top-1/2 left-1/2 w-5 md:w-8 h-5 md:h-12 transform -translate-x-1/2 -translate-y-1/2 "
                />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default TrailersSection