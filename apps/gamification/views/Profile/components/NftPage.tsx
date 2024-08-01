import { Trans } from '@pancakeswap/localization'
import { FlexGap, Text } from '@pancakeswap/uikit'
import { useProfileForAddress } from 'hooks/useProfile'
import { useState } from 'react'
import { styled } from 'styled-components'
import ActivityHistory from 'views/Profile/components/ActivityHistory'
import UnconnectedProfileNfts from 'views/Profile/components/UnconnectedProfileNfts'
import UserNfts from 'views/Profile/components/UserNfts'
import { useNftsForAddress } from 'views/ProfileCreation/Nft/hooks/useNftsForAddress'
import { useAccount } from 'wagmi'

const BaseSubMenu = styled(FlexGap)`
  gap: 20px;
  justify-content: center;
  margin-bottom: 18px;
  border-bottom: 1px ${({ theme }) => theme.colors.cardBorder} solid;
`

const StyledMenuList = styled(Text)<{ $active: boolean }>`
  position: relative;
  padding: 0 4px;
  line-height: 42px;
  cursor: pointer;
  font-weight: ${({ $active }) => ($active ? 600 : 400)};
  color: ${({ theme, $active }) => ($active ? theme.colors.secondary : theme.colors.textSubtle)};

  &:before {
    display: ${({ $active }) => ($active ? 'block' : 'none')};
    content: '';
    position: absolute;
    left: 0;
    bottom: 0px;
    height: 4px;
    width: 100%;
    background-color: ${({ theme }) => theme.colors.primary};
    border-radius: 2px 2px 0px 0px;
  }
`

enum NftMenuType {
  Items = 'Items',
  Activity = 'Activity',
}

const ItemsConfig = [
  {
    label: <Trans>Items</Trans>,
    id: NftMenuType.Items,
  },
]

export const NftPage = () => {
  const [showMenu, setShowMenu] = useState(NftMenuType.Items)
  const { address: account } = useAccount()
  const accountAddress = account?.toLowerCase() as string

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
      <BaseSubMenu>
        {ItemsConfig.map((item) => (
          <StyledMenuList key={item.id} $active={showMenu === item.id} onClick={() => setShowMenu(item.id)}>
            {item.label}
          </StyledMenuList>
        ))}
      </BaseSubMenu>
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
