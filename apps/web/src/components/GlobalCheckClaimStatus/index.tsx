import { useEffect, useState } from 'react'
import { ChainId } from '@pancakeswap/sdk'
import { ModalV2 } from '@pancakeswap/uikit'
import { useAccount } from 'wagmi'
import { useV3AirdropContract } from 'hooks/useContract'
import { useRouter } from 'next/router'
import useSWRImmutable from 'swr/immutable'
import useAccountActiveChain from 'hooks/useAccountActiveChain'
import { FetchStatus } from 'config/constants/types'
import useSWR from 'swr'
import V3AirdropModal, { WhitelistType } from './V3AirdropModal'

interface GlobalCheckClaimStatusProps {
  excludeLocations: string[]
}

// change it to true if we have events to check claim status
const enable = true

const GlobalCheckClaimStatus: React.FC<React.PropsWithChildren<GlobalCheckClaimStatusProps>> = (props) => {
  const { account, chainId } = useAccountActiveChain()
  if (!enable || chainId !== ChainId.BSC || !account) {
    return null
  }
  return <GlobalCheckClaim key={account} {...props} />
}

/**
 * This is represented as a component rather than a hook because we need to keep it
 * inside the Router.
 *
 * TODO: Put global checks in redux or make a generic area to house global checks
 */
const GITHUB_ENDPOINT = 'https://raw.githubusercontent.com/pancakeswap/airdrop-v3-users/master'

const GlobalCheckClaim: React.FC<React.PropsWithChildren<GlobalCheckClaimStatusProps>> = ({ excludeLocations }) => {
  const { address: account } = useAccount()
  const { pathname } = useRouter()
  const v3Airdrop = useV3AirdropContract()
  const [show, setShow] = useState(false)

  const { data: isAccountClaimed, status: accountClaimedStatus } = useSWR(
    account && [account, '/airdrop-claimed'],
    async () => v3Airdrop.read.isClaimed([account]),
    {
      revalidateOnFocus: false,
      revalidateIfStale: false,
      revalidateOnReconnect: false,
    },
  )

  const { data: v3WhitelistAddress } = useSWRImmutable(
    !isAccountClaimed && accountClaimedStatus === FetchStatus.Fetched && '/airdrop-whitelist-json',
    async () => (await fetch(`${GITHUB_ENDPOINT}/forFE.json`)).json(),
  )

  useEffect(() => {
    if (
      accountClaimedStatus === FetchStatus.Fetched &&
      !isAccountClaimed &&
      v3WhitelistAddress?.[account?.toLowerCase()] &&
      !excludeLocations.some((location) => pathname.includes(location))
    ) {
      setShow(true)
    } else {
      setShow(false)
    }
  }, [account, accountClaimedStatus, excludeLocations, isAccountClaimed, pathname, setShow, v3WhitelistAddress])

  return (
    <ModalV2 isOpen={show} onDismiss={() => setShow(false)} closeOnOverlayClick>
      <V3AirdropModal
        data={account ? (v3WhitelistAddress?.[account.toLowerCase()] as WhitelistType) : (null as WhitelistType)}
      />
    </ModalV2>
  )
}

export default GlobalCheckClaimStatus
