import { useQuery } from '@tanstack/react-query'
import { useV3AirdropContract } from 'hooks/useContract'
import { useMemo } from 'react'
import { useAccount } from 'wagmi'

interface AirdropModalStatus {
  shouldShowModal: boolean
  v3WhitelistAddress: any
}

const GITHUB_ENDPOINT = 'https://raw.githubusercontent.com/pancakeswap/airdrop-v3-users/master'

const useAirdropModalStatus = (): AirdropModalStatus => {
  const { address: account } = useAccount()
  const v3Airdrop = useV3AirdropContract()

  const { data: isAccountClaimed, status: accountClaimedStatus } = useQuery({
    queryKey: [account, '/airdrop-claimed'],

    queryFn: async () => {
      if (!account) return undefined
      return v3Airdrop.read.isClaimed([account])
    },

    enabled: Boolean(account),
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
  })

  const { data: v3WhitelistAddress } = useQuery({
    queryKey: ['/airdrop-whitelist-json'],
    queryFn: async () => (await fetch(`${GITHUB_ENDPOINT}/forFE.json`)).json(),
    enabled: Boolean(!isAccountClaimed && accountClaimedStatus === 'success'),
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
  })

  const shouldShowModal = useMemo(() => {
    return (
      accountClaimedStatus === 'success' && !isAccountClaimed && account && v3WhitelistAddress?.[account.toLowerCase()]
    )
  }, [account, accountClaimedStatus, isAccountClaimed, v3WhitelistAddress])

  return {
    shouldShowModal,
    v3WhitelistAddress,
  }
}

export default useAirdropModalStatus
