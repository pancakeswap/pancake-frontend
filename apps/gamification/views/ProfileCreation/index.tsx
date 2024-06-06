import Page from 'components/Layout/Page'
import PageLoader from 'components/Loader/PageLoader'
import { useProfile } from 'hooks/useProfile'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { ProfileUrlType } from 'views/Profile/components/TabMenu'
import { useAccount } from 'wagmi'
import Header from './Header'
import Steps from './Steps'
import ProfileCreationProvider from './contexts/ProfileCreationProvider'

const ProfileCreation = () => {
  const { address: account } = useAccount()
  const { isInitialized, isLoading, hasProfile } = useProfile()
  const router = useRouter()

  useEffect(() => {
    if (account && hasProfile) {
      router.push(`${ProfileUrlType.NFT}`)
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
