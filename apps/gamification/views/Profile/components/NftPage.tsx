import { Trans } from '@pancakeswap/localization'
import { useProfileForAddress } from 'hooks/useProfile'
import { useState } from 'react'
import ActivityHistory from 'views/Profile/components/ActivityHistory'
import SubMenu from 'views/Profile/components/SubMenu'
import UnconnectedProfileNfts from 'views/Profile/components/UnconnectedProfileNfts'
import UserNfts from 'views/Profile/components/UserNfts'
import { useNftsForAddress } from 'views/ProfileCreation/Nft/hooks/useNftsForAddress'
import { useAccount } from 'wagmi'

enum NftMenuType {
  Items = 'Items',
  Activity = 'Activity',
}

const ItemsConfig = [
  {
    label: <Trans>Items</Trans>,
    href: NftMenuType.Items,
  },
  {
    label: <Trans>Activity</Trans>,
    href: NftMenuType.Activity,
  },
]

export const NftPage = () => {
  const [showMenu, setShowMenu] = useState(NftMenuType.Items)
  const { address: account } = useAccount()
  const accountAddress = account as string

  const {
    profile,
    isValidating: isProfileFetching,
    refresh: refreshProfile,
  } = useProfileForAddress(accountAddress, {
    revalidateIfStale: true,
    revalidateOnFocus: true,
    revalidateOnReconnect: true,
  })

  const {
    nfts,
    isLoading: isNftLoading,
    refresh: refreshUserNfts,
  } = useNftsForAddress({ account: accountAddress, profile, isProfileFetching })

  return (
    <>
      <SubMenu />
      {showMenu === NftMenuType.Items ? (
        <>
          {account ? (
            <UserNfts
              nfts={nfts}
              isLoading={isNftLoading}
              onSuccessSale={refreshUserNfts}
              onSuccessEditProfile={async () => {
                await refreshProfile()
                refreshUserNfts()
              }}
            />
          ) : (
            <UnconnectedProfileNfts nfts={nfts} isLoading={isNftLoading} />
          )}
        </>
      ) : (
        <ActivityHistory />
      )}
    </>
  )
}
