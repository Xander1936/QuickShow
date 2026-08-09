import React from 'react'
import HeroSection from '../components/HeroSection'
import FeaturedSection from '../components/FeaturedSection'
import TrailersSection from '../components/TrailersSection'

// Home page component. This is the landing page rendered at the '/' route.
const Home = () => {
  return (
    <>
      <HeroSection />
      <FeaturedSection />
      <TrailersSection />
    </>
  )
}

export default Home
