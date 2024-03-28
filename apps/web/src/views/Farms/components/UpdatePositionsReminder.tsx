import { useIsMounted } from '@pancakeswap/hooks'
import { Trans, useTranslation } from '@pancakeswap/localization'
import { AtomBox, Button, LinkExternal, Modal, ModalV2, Text, useModalV2, useToast } from '@pancakeswap/uikit'
import { MasterChefV3, Multicall } from '@pancakeswap/v3-sdk'
import { useActiveChainId } from 'hooks/useActiveChainId'
import useCatchTxError from 'hooks/useCatchTxError'
import { useMasterchefV3 } from 'hooks/useContract'
import { useTransactionDeadline } from 'hooks/useTransactionDeadline'
import { useV3TokenIdsByAccount } from 'hooks/v3/useV3Positions'
import { useMemo, useState } from 'react'
import { useFarmsV3Public } from 'state/farmsV3/hooks'
import { Hex, encodeFunctionData } from 'viem'
import { useAccount, useReadContracts, useSendTransaction } from 'wagmi'

const lmPoolABI = [
  {
    inputs: [
      {
        internalType: 'int24',
        name: 'tickLower',
        type: 'int24',
      },
      {
        internalType: 'int24',
        name: 'tickUpper',
        type: 'int24',
      },
    ],
    name: 'getRewardGrowthInside',
    outputs: [
      {
        internalType: 'uint256',
        name: 'rewardGrowthInsideX128',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'rewardGrowthGlobalX128',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
] as const

export function UpdatePositionsReminder() {
  const { address: account } = useAccount()
  const { chainId } = useActiveChainId()
  const isMounted = useIsMounted()
  // eslint-disable-next-line react/jsx-pascal-case
  return account && chainId && isMounted && <UpdatePositionsReminder_ key={`${account}-${chainId}`} />
}

export function UpdatePositionsReminder_() {
  const { t } = useTranslation()
  const { data: farmsV3 } = useFarmsV3Public()
  const { address: account } = useAccount()
  const { chainId } = useActiveChainId()

  const masterchefV3 = useMasterchefV3()
  const { tokenIds: stakedTokenIds, loading } = useV3TokenIdsByAccount(masterchefV3?.address, account)

  const stakedUserInfos = useReadContracts({
    contracts: useMemo(
      () =>
        stakedTokenIds.map((tokenId) => ({
          abi: masterchefV3?.abi,
          address: masterchefV3?.address,
          functionName: 'userPositionInfos',
          args: [tokenId.toString()],
          chainId,
        })),
      [chainId, masterchefV3, stakedTokenIds],
    ),
    query: {
      staleTime: Infinity,
      enabled: Boolean(!loading && stakedTokenIds.length > 0 && masterchefV3),
    },
  })

  const isOverRewardGrowthGlobalUserInfos = stakedUserInfos?.data
    ?.map((userInfo: any, i) => ({
      ...userInfo,
      tokenId: stakedTokenIds[i],
    }))
    ?.filter((userInfo) => {
      if (!userInfo?.pid) return false
      const farm = farmsV3?.farmsWithPrice.find((f) => f.pid === Number(userInfo.pid))
      if (!farm) return false
      if (
        userInfo.rewardGrowthInside >
        BigInt(
          // @ts-ignore
          farm._rewardGrowthGlobalX128,
        )
      ) {
        return true
      }
      return true
    })

  // getting it on client side to final confirm
  const { data: rewardGrowthGlobalX128s, isLoading } = useReadContracts({
    contracts: isOverRewardGrowthGlobalUserInfos?.map((userInfo) => {
      const farm = farmsV3?.farmsWithPrice.find((f) => f.pid === Number(userInfo.pid))
      return {
        abi: lmPoolABI,
        address: farm?.lmPool as `0x${string}`,
        functionName: 'rewardGrowthGlobalX128',
        args: [],
        chainId,
      }
    }),
    query: {
      staleTime: Infinity,
      enabled: (isOverRewardGrowthGlobalUserInfos?.length ?? 0) > 0,
    },
  })

  const needRetrigger = isOverRewardGrowthGlobalUserInfos
    ?.filter((u, i) => {
      if (rewardGrowthGlobalX128s?.[i]) {
        return u.rewardGrowthInside.gt(rewardGrowthGlobalX128s[i])
      }
      return false
    })
    ?.map((u) => {
      return {
        ...u,
        needReduce: true,
      }
    })

  const modal = useModalV2()

  const { sendTransactionAsync } = useSendTransaction()
  const { toastSuccess } = useToast()
  const { loading: txLoading, fetchWithCatchTxError } = useCatchTxError()

  const masterChefV3Address = useMasterchefV3()?.address
  const [deadline] = useTransactionDeadline() // custom from users settings

  const [triggerOnce, setTriggerOnce] = useState(false)

  // eslint-disable-next-line consistent-return
  const handleUpdateAll = async () => {
    if (!needRetrigger || !sendTransactionAsync) return null
    const calldata: (Hex | Hex[])[] = []
    needRetrigger.forEach((userInfo) => {
      if (userInfo.needReduce) {
        calldata.push(
          encodeFunctionData({
            abi: MasterChefV3.ABI,
            functionName: 'decreaseLiquidity',
            args: [
              {
                tokenId: BigInt(userInfo.tokenId.toString()),
                liquidity: 1n,
                amount0Min: 0n,
                amount1Min: 0n,
                deadline: deadline ?? 0n,
              },
            ],
          }),
        )
      }
      calldata.push(
        MasterChefV3.encodeHarvest({
          to: account || '0x',
          tokenId: userInfo.tokenId.toString(),
        }),
      )
    })

    const resp = await fetchWithCatchTxError(() =>
      sendTransactionAsync({
        to: masterChefV3Address!,
        data: Multicall.encodeMulticall(calldata.flat()),
        value: 0n,
        account,
      }),
    )

    if (resp?.status) {
      toastSuccess(`Updated!`)

      stakedUserInfos.refetch()
      modal.onDismiss()
    }
  }

  if (
    !triggerOnce &&
    needRetrigger &&
    needRetrigger.length > 0 &&
    !stakedUserInfos.isLoading &&
    !isLoading &&
    isOverRewardGrowthGlobalUserInfos
  ) {
    setTriggerOnce(true)
    modal.onOpen()
    console.info(needRetrigger, 'needRetrigger')
  }

  return (
    <ModalV2 {...modal} closeOnOverlayClick>
      <Modal title={t('Update Positions')}>
        <AtomBox textAlign="center">
          <Text>
            <Trans>The followings farming positions require updates to continue earning</Trans>:
          </Text>
          {needRetrigger && (
            <Text my="24px" mb="48px" bold>
              {needRetrigger.map((u) => `#${u.tokenId.toString()}`).join(', ')}
            </Text>
          )}
          <LinkExternal
            m="auto"
            href="https://docs.pancakeswap.finance/products/yield-farming/faq#why-am-i-seeing-an-update-positions-pop-up"
          >
            <Trans>Learn More</Trans>
          </LinkExternal>
          <Button
            mt="12px"
            width="100%"
            disabled={txLoading}
            onClick={() => {
              handleUpdateAll()
            }}
          >
            {txLoading ? <Trans>Updating...</Trans> : <Trans>Update All</Trans>}
          </Button>
        </AtomBox>
      </Modal>
    </ModalV2>
  )
}
