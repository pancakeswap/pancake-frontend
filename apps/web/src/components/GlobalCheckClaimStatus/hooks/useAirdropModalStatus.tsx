import { useMemo } from 'react'
import { useAccount } from 'wagmi'
import { useV3AirdropContract } from 'hooks/useContract'
import useSWRImmutable from 'swr/immutable'
import { FetchStatus } from 'config/constants/types'
import useSWR from 'swr'

interface AirdropModalStatus {
  shouldShowModal: boolean
  v3WhitelistAddress: any
}

const GITHUB_ENDPOINT = 'https://raw.githubusercontent.com/pancakeswap/airdrop-v3-users/master'

const useAirdropModalStatus = (): AirdropModalStatus => {
  const { address: account } = useAccount()
  const v3Airdrop = useV3AirdropContract()

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

  const shouldShowModal = useMemo(() => {
    return (
      accountClaimedStatus === FetchStatus.Fetched && !isAccountClaimed && v3WhitelistAddress?.[account?.toLowerCase()]
    )
  }, [account, accountClaimedStatus, isAccountClaimed, v3WhitelistAddress])

  return {
    shouldShowModal,
    v3WhitelistAddress,
  }
}

export default useAirdropModalStatus
