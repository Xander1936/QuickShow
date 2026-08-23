import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { assets, dummyShowsData } from '../assets/assets'
import { MenuIcon, SearchIcon, TicketPlus, XIcon } from 'lucide-react'
import { useClerk, UserButton, useUser } from '@clerk/react'

// Shared navigation links used by the top navbar and the mobile menu.
const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/movies', label: 'Movies' },
  { to: '/', label: 'Theaters' },
  { to: '/', label: 'Releases' },
  { to: '/favorite', label: 'Favorites' },
]

const Navbar = () => {
  // Controls the mobile menu visibility on small screens.
  const [isOpen, setIsOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const {user} = useUser()
  const {openSignIn} = useClerk()

  const navigate = useNavigate()
  const searchResults = searchQuery.trim()
    ? dummyShowsData.filter((movie) => movie.title.toLowerCase().includes(searchQuery.trim().toLowerCase()))
    : []

  const closeSearch = () => {
    setIsSearchOpen(false)
    setSearchQuery('')
  }

  const openMovie = (movieId) => {
    navigate(`/movies/${movieId}`)
    closeSearch()
  }

  return (
    <header className='fixed left-0 top-0 z-50 w-full px-4 py-4 md:px-8 lg:px-16'>
      <div className='mx-auto flex max-w-7xl items-center justify-between gap-1 rounded-full border border-gray-300/20 bg-black/70 px-4 py-3 backdrop-blur md:px-6 sm:gap-3'>
        <Link to='/' className='flex-shrink-0'>
          <img src={assets.logo} alt='QuickShow logo' className='h-auto w-28 sm:w-32 md:w-36' />
        </Link>

        <nav className={`hidden flex-1 items-center justify-center gap-3 overflow-x-auto px-2 text-sm sm:gap-4 md:gap-6 md:flex`}>
          {navLinks.map((link) => (
            <Link
              key={link.label}
              to={link.to}
              className='whitespace-nowrap transition hover:text-white/80'
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {isOpen && (
          <div className='fixed inset-0 z-40 md:hidden'>
            <div className='absolute inset-0 bg-black/40 backdrop-blur-sm' onClick={() => setIsOpen(false)} />

            <div className='absolute left-4 top-16 w-64 max-w-[80%] rounded-lg bg-black/70 text-white p-4'>
              <div className='grid grid-cols-2 gap-4'>
                <div className='row-start-1 col-start-1 flex items-start'>
                  <button
                    type='button'
                    onClick={() => setIsOpen(false)}
                    aria-label='Close menu'
                    className='inline-flex h-10 w-10 items-center justify-center rounded-full transition hover:bg-white/10'
                  >
                    <XIcon 
                      className='md:hidden absolute top-6 h-5 w-5 cursor-pointer'
                      onClick={() => setIsOpen(!isOpen)} 
                    />
                  </button>
                </div>

                <div className='row-start-2 col-start-2 flex flex-col gap-3 text-sm'>
                  {navLinks.map((link) => (
                    <Link
                      key={link.label}
                      to={link.to}
                      onClick={() => {scrollTo(0,0); setIsOpen(false)}}
                      className='whitespace-nowrap transition hover:text-white/80'
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        <div className='flex items-center gap-10 sm:gap-8'>
          <div className='relative block'>
            <button
              type='button'
              onClick={() => setIsSearchOpen((open) => !open)}
              aria-label='Search movies'
              className='flex h-8 w-8 cursor-pointer items-center justify-center rounded-full transition hover:bg-white/10'
            >
              <SearchIcon className='h-5 w-5' />
            </button>

            {isSearchOpen && (
              <div className='fixed left-1/2 top-20 w-64 -translate-x-1/2 rounded-lg border border-white/10 bg-black/90 p-2 shadow-lg sm:absolute sm:right-0 sm:left-auto sm:top-10 sm:translate-x-0'>
                <input
                  autoFocus
                  type='search'
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === 'Escape') closeSearch()
                    if (event.key === 'Enter' && searchResults[0]) openMovie(searchResults[0]._id)
                  }}
                  placeholder='Search movies'
                  aria-label='Search movies'
                  className='w-full rounded-md border border-white/20 bg-white/10 px-3 py-2 text-sm text-white outline-none placeholder:text-white/50 focus:border-primary'
                />
                {searchQuery.trim() && (
                  <div className='mt-2 max-h-48 overflow-y-auto'>
                    {searchResults.length > 0 ? searchResults.map((movie) => (
                      <button
                        key={movie._id}
                        type='button'
                        onClick={() => openMovie(movie._id)}
                        className='block w-full rounded px-2 py-2 text-left text-sm transition hover:bg-white/10'
                      >
                        {movie.title}
                      </button>
                    )) : (
                      <p className='px-2 py-2 text-sm text-white/60'>No movies found</p>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
          {
            !user ? (
              <button 
                onClick={openSignIn} 
                className='cursor-pointer rounded-full bg-primary px-4 py-2 text-sm font-medium transition hover:bg-primary-dull sm:px-6'
              >
                Login
              </button>
            ) : (
              <UserButton>
                <UserButton.MenuItems>
                  <UserButton.Action 
                    label="My Bookings" 
                    labelIcon={<TicketPlus width={15}/>} 
                    onClick={()=>navigate('/my-bookings')} 
                  />
                </UserButton.MenuItems>
              </UserButton>
            )
          }
        </div>

        <button
          type='button'
          onClick={() => setIsOpen(true)}
          className='inline-flex h-10 w-10 items-center justify-center rounded-full transition hover:bg-white/10 md:hidden'
          aria-label='Open menu'
        >
          <MenuIcon className='h-5 w-5' />
        </button>
      </div>
    </header>
  )
}

export default Navbar
