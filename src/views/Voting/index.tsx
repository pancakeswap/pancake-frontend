import React, { useEffect } from 'react'
import Hero from './components/Hero'
import Footer from './components/Footer'
import { Proposals } from './components/Proposals'
import { getProposals } from './helpers'

const Voting = () => {
  useEffect(() => {
    getProposals()
  }, [])

  return (
    <>
      <Hero />
      <Proposals />
      <Footer />
    </>
  )
}

export default Voting
