import { useEffect } from 'react'
import { useWeb3React } from '@pancakeswap/wagmi'
import Page from 'components/Layout/Page'
import { useProfile } from 'state/profile/hooks'
import PageLoader from 'components/Loader/PageLoader'
import { useRouter } from 'next/router'
import Header from './Header'
import ProfileCreationProvider from './contexts/ProfileCreationProvider'
import Steps from './Steps'

const ProfileCreation = () => {
  const { account } = useWeb3React()
  const { isInitialized, isLoading, hasProfile } = useProfile()
  const router = useRouter()

  useEffect(() => {
    if (account && hasProfile) {
      router.push(`/profile/${account.toLowerCase()}`)
    }
  }, [account, hasProfile, router])

  if (!isInitialized || isLoading) {
    return <PageLoader />
  }

  return (
    <>
      <ProfileCreationProvider>
        <Page>
          <Header />
          <Steps />
        </Page>
      </ProfileCreationProvider>
    </>
  )
}

export default ProfileCreation
