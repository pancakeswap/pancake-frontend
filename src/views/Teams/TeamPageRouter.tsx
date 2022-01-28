import React from 'react'
import { useRouter } from 'next/router'
import PageLoader from '../../components/Loader/PageLoader'
import Team from './Team'

const TeamPageRouter = () => {
  const router = useRouter()

  if (router.isFallback) {
    return <PageLoader />
  }

  return <Team />
}

export default TeamPageRouter
