import { useWeb3React } from '@web3-react/core'
import { useRouter } from 'next/router'
import React from 'react'
import { useProfileForAddress } from 'state/profile/hooks'
import { NftProfileLayout } from 'views/Nft/market/Profile'
import SubMenu from 'views/Nft/market/Profile/components/SubMenu'
import UnconnectedProfileNfts from 'views/Nft/market/Profile/components/UnconnectedProfileNfts'
import UserNfts from 'views/Nft/market/Profile/components/UserNfts'
import useNftsForAddress from 'views/Nft/market/Profile/hooks/useNftsForAddress'

const NftProfilePage = () => {
  const { account } = useWeb3React()
  const accountAddress = useRouter().query.accountAddress as string
  const isConnectedProfile = account?.toLowerCase() === accountAddress?.toLowerCase()

  return (
    <>
      <SubMenu />
      {isConnectedProfile ? <UserNfts /> : <UnconnectedProfileNftsContainer />}
    </>
  )
}

const UnconnectedProfileNftsContainer = () => {
  const accountAddress = useRouter().query.accountAddress as string
  const { profile: profileHookState, isFetching: isProfileFetching } = useProfileForAddress(accountAddress)
  const { profile } = profileHookState || {}
  const { nfts, isLoading: isNftLoading } = useNftsForAddress(accountAddress, profile, isProfileFetching)

  return <UnconnectedProfileNfts nfts={nfts} isLoading={isNftLoading} />
}

NftProfilePage.Layout = NftProfileLayout

export default NftProfilePage
