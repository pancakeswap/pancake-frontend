import { useProfile } from 'hooks/useProfile'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { NftProfileLayout } from 'views/Profile'
import { JoinedQuests } from 'views/Profile/components/JoinedQuests'
import { NftPage } from 'views/Profile/components/NftPage'
import { useAccount } from 'wagmi'

const ProfilePage = () => {
  const { address: account } = useAccount()
  const router = useRouter()
  const { asPath } = router
  const { isInitialized, isLoading, profile } = useProfile()
  const hasProfile = isInitialized && !!profile

  const hashNftFragment = !!asPath.includes('#nft')

  useEffect(() => {
    if (account && !isLoading && !hasProfile) {
      router.push('/create-profile')
    }
  }, [account, hasProfile, isLoading, router])

  return <>{hasProfile && <>{!hashNftFragment ? <JoinedQuests /> : <NftPage />}</>}</>
}

ProfilePage.chains = []
ProfilePage.Layout = NftProfileLayout

export default ProfilePage
