// IMPORTANT: This module is part of the QuickShow application. It contains the core UI or server logic for this feature and should remain behaviorally identical while editing.

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
