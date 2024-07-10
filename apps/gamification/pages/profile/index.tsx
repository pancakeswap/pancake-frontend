import { useProfile } from 'hooks/useProfile'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { NftProfileLayout } from 'views/Profile'
import { AchievementsPage } from 'views/Profile/components/Achievements/AchievementsPage'
import { NftPage } from 'views/Profile/components/NftPage'
import { ProfileUrlType } from 'views/Profile/components/TabMenu'
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

  return (
    <>
      {hasProfile && (
        <>
          {router.asPath === ProfileUrlType.HOME_PAGE && <>Coming Soon</>}
          {router.asPath === ProfileUrlType.NFT && <NftPage />}
          {router.asPath === ProfileUrlType.ACHIEVEMENT && <AchievementsPage />}
        </>
      )}
    </>
  )
}

ProfilePage.Layout = NftProfileLayout

export default ProfilePage
