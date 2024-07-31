import { SUPPORT_ONLY_BSC } from 'config/supportedChain'
import { useProfile } from 'hooks/useProfile'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { NftProfileLayout } from 'views/Profile'
import { AchievementsPage } from 'views/Profile/components/Achievements/AchievementsPage'
import { JoinedQuests } from 'views/Profile/components/JoinedQuests'
import { NftPage } from 'views/Profile/components/NftPage'
import { ProfileUrlType } from 'views/Profile/components/TabMenu'
import { useAccount } from 'wagmi'

const ProfilePage = () => {
  const { address: account } = useAccount()
  const router = useRouter()
  const { asPath } = router
  const { isInitialized, isLoading, profile } = useProfile()
  const hasProfile = isInitialized && !!profile

  // Extract the path without query parameters and hash fragment
  const [pathWithoutQuery] = asPath.split('?')
  const [pathWithoutHash] = pathWithoutQuery.split('#')
  // Extract hash fragment if it exists
  const hashFragment = asPath.includes('#') ? asPath.split('#')[1].split('?')[0] : ''
  // Reconstruct the full path including hash fragment if it exists
  const fullPath = hashFragment ? `${pathWithoutHash}#${hashFragment}` : pathWithoutHash

  useEffect(() => {
    if (account && !isLoading && !hasProfile) {
      router.push('/create-profile')
    }
  }, [account, hasProfile, isLoading, router])

  return (
    <>
      {hasProfile && (
        <>
          {fullPath === ProfileUrlType.HOME_PAGE && <JoinedQuests />}
          {fullPath === ProfileUrlType.NFT && <NftPage />}
          {fullPath === ProfileUrlType.ACHIEVEMENT && <AchievementsPage />}
        </>
      )}
    </>
  )
}

ProfilePage.chains = SUPPORT_ONLY_BSC
ProfilePage.Layout = NftProfileLayout

export default ProfilePage
