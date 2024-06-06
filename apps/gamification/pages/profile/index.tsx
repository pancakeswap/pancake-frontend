import { useProfile } from 'hooks/useProfile'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { NftProfileLayout } from 'views/Profile'
import { useAccount } from 'wagmi'

const ProfilePage = () => {
  const { address: account } = useAccount()
  const router = useRouter()
  const { isInitialized, isLoading, profile } = useProfile()
  const hasProfile = isInitialized && !!profile

  useEffect(() => {
    if (account && !isLoading && !hasProfile) {
      router.push('/create-profile')
    }
  }, [account, hasProfile, isLoading, router])

  return <>{hasProfile && 'should show data'}</>
}

ProfilePage.Layout = NftProfileLayout

export default ProfilePage
