import { useState } from 'react'
import { Link } from 'react-router-dom'
import { assets } from '../assets/assets'
import { MenuIcon, SearchIcon, XIcon } from 'lucide-react'

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

  return (
    <header className='fixed left-0 top-0 z-50 w-full px-4 py-4 md:px-8 lg:px-16'>
      <div className='mx-auto flex max-w-7xl items-center justify-between gap-3 rounded-full border border-gray-300/20 bg-black/70 px-4 py-3 backdrop-blur md:px-6'>
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
                    <XIcon className='h-5 w-5' />
                  </button>
                </div>

                <div className='row-start-2 col-start-2 flex flex-col gap-3 text-sm'>
                  {navLinks.map((link) => (
                    <Link
                      key={link.label}
                      to={link.to}
                      onClick={() => setIsOpen(false)}
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

        <div className='flex items-center gap-3 sm:gap-4'>
          <SearchIcon className='hidden h-5 w-5 cursor-pointer md:block' />
          <button className='cursor-pointer rounded-full bg-primary px-4 py-2 text-sm font-medium transition hover:bg-primary-dull sm:px-6'>
            Login
          </button>
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
