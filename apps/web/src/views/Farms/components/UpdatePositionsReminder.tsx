import { useTranslation } from '@pancakeswap/localization'
import { AtomBox } from '@pancakeswap/ui'
import { Button, Modal, ModalV2, Text, useModalV2, useToast } from '@pancakeswap/uikit'
import { MasterChefV3, Multicall, toHex } from '@pancakeswap/v3-sdk'
import { ToastDescriptionWithTx } from 'components/Toast'
import { BigNumber } from 'ethers'
import { FormatTypes } from 'ethers/lib/utils'
import { useActiveChainId } from 'hooks/useActiveChainId'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import useCatchTxError from 'hooks/useCatchTxError'
import { useMasterchefV3 } from 'hooks/useContract'
import useTransactionDeadline from 'hooks/useTransactionDeadline'
import { useV3TokenIdsByAccount } from 'hooks/v3/useV3Positions'
import { useEffect, useMemo, useState } from 'react'
import { useFarmsV3Public } from 'state/farmsV3/hooks'
import { calculateGasMargin } from 'utils'
import { useContractReads, useSigner } from 'wagmi'

const lmPoolAbi = [
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
] as const

export function UpdatePositionsReminder() {
  const { data: farmsV3 } = useFarmsV3Public()
  const { account } = useActiveWeb3React()
  const { chainId } = useActiveChainId()

  const masterchefV3 = useMasterchefV3(false)
  const { tokenIds: stakedTokenIds, loading } = useV3TokenIdsByAccount(masterchefV3, account)

  const stakedUserInfos = useContractReads({
    contracts: useMemo(
      () =>
        stakedTokenIds.map((tokenId) => ({
          abi: masterchefV3.interface.format(FormatTypes.json) as any,
          address: masterchefV3.address as `0x${string}`,
          functionName: 'userPositionInfos',
          args: [tokenId.toString()],
          chainId,
        })),
      [chainId, masterchefV3.address, masterchefV3.interface, stakedTokenIds],
    ),
    enabled: !loading && stakedTokenIds.length > 0,
  })

  const isOverRewardGrowthGlobalUserInfos = stakedUserInfos.data
    ?.map((userInfo: any, i) => ({
      ...userInfo,
      tokenId: stakedTokenIds[i],
    }))
    .filter((userInfo) => {
      const farm = farmsV3?.farmsWithPrice.find((f) => f.pid === (userInfo.pid as BigNumber).toNumber())
      if (!farm) return false

      if (
        (userInfo.rewardGrowthInside as BigNumber).gt(
          // @ts-ignore
          farm._rewardGrowthGlobalX128,
        )
      ) {
        return true
      }
      return false
    })

  const { data: getRewardGrowthInsides } = useContractReads({
    contracts: isOverRewardGrowthGlobalUserInfos?.map((userInfo) => {
      const farm = farmsV3?.farmsWithPrice.find((f) => f.pid === (userInfo.pid as BigNumber).toNumber())
      return {
        abi: lmPoolAbi,
        address: farm?.lmPool as `0x${string}`,
        functionName: 'getRewardGrowthInside',
        args: [userInfo.tickLower, userInfo.tickUpper],
        chainId,
      }
    }),
    enabled: isOverRewardGrowthGlobalUserInfos?.length > 0,
  })

  const needRetrigger = isOverRewardGrowthGlobalUserInfos?.map((u, i) => {
    let needReduce = false
    const lmRewardGrowthInside = getRewardGrowthInsides?.[i]
    const farm = farmsV3?.farmsWithPrice.find((f) => f.pid === (u.pid as BigNumber).toNumber())
    if (lmRewardGrowthInside && farm) {
      needReduce = BigNumber.from(lmRewardGrowthInside).gt(
        // @ts-ignore
        farm._rewardGrowthGlobalX128,
      )
    }
    return {
      ...u,
      lmRewardGrowthInside,
      needReduce,
    }
  })

  const modal = useModalV2()

  const { t } = useTranslation()
  const { data: signer } = useSigner()
  const { toastSuccess } = useToast()
  const { loading: txLoading, fetchWithCatchTxError } = useCatchTxError()

  const masterChefV3Address = useMasterchefV3()?.address
  const deadline = useTransactionDeadline() // custom from users settings

  const [triggerOnce, setTriggerOnce] = useState(false)

  // eslint-disable-next-line consistent-return
  const handleUnStuckAll = async () => {
    if (!needRetrigger) return null
    const calldata = []
    needRetrigger.forEach((userInfo) => {
      if (userInfo.needReduce) {
        calldata.push(
          MasterChefV3.INTERFACE.encodeFunctionData('decreaseLiquidity', [
            {
              tokenId: toHex(userInfo.tokenId.toString()),
              liquidity: toHex(1),
              amount0Min: toHex(0),
              amount1Min: toHex(0),
              deadline: toHex(deadline.toString()),
            },
          ]),
        )
      }
      calldata.push(
        MasterChefV3.encodeHarvest({
          to: account,
          tokenId: userInfo.tokenId.toString(),
        }),
      )
    })

    const txn = {
      to: masterChefV3Address,
      data: Multicall.encodeMulticall(calldata.flat()),
      value: toHex(0),
    }

    const resp = await fetchWithCatchTxError(() =>
      signer.estimateGas(txn).then((estimate) => {
        const newTxn = {
          ...txn,
          gasLimit: calculateGasMargin(estimate),
        }

        return signer.sendTransaction(newTxn)
      }),
    )

    if (resp?.status) {
      toastSuccess(
        `${t('Harvested')}!`,
        <ToastDescriptionWithTx txHash={resp.transactionHash}>
          {t('Your %symbol% earnings have been sent to your wallet!', { symbol: 'CAKE' })}
        </ToastDescriptionWithTx>,
      )

      stakedUserInfos.refetch()
    }
  }

  useEffect(() => {
    console.info('needRetrigger', needRetrigger)
  }, [needRetrigger, triggerOnce])

  if (!triggerOnce && needRetrigger?.length > 0) {
    setTriggerOnce(true)
    modal.onOpen()
  }

  return (
    <ModalV2 {...modal} closeOnOverlayClick>
      <Modal title="Update Positions">
        <AtomBox>
          <Text>The followings farming positions require updates to continue earnings</Text>
          {needRetrigger && <Text>{needRetrigger.map((u) => `#${u.tokenId.toString()}`).join(', ')}</Text>}
          <Button
            disabled={txLoading}
            onClick={() => {
              handleUnStuckAll()
            }}
          >
            {txLoading ? 'Harvesting...' : 'Harvest'}
          </Button>
        </AtomBox>
      </Modal>
    </ModalV2>
  )
}
