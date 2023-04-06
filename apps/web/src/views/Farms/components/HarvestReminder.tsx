import { AtomBox } from '@pancakeswap/ui'
import { Button, Modal, ModalV2, useModalV2 } from '@pancakeswap/uikit'
import { BigNumber } from 'ethers'
import { FormatTypes } from 'ethers/lib/utils'
import { useActiveChainId } from 'hooks/useActiveChainId'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { useMasterchefV3 } from 'hooks/useContract'
import { useV3TokenIdsByAccount } from 'hooks/v3/useV3Positions'
import { useMemo, useState } from 'react'
import { useFarmsV3Public } from 'state/farmsV3/hooks'
import { useContractReads } from 'wagmi'
import { useFarmsV3BatchHarvest } from '../hooks/v3/useFarmV3Actions'

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

export function HarvestReminder() {
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

  const canHarvestToRetrigger = isOverRewardGrowthGlobalUserInfos?.filter((userInfo, i) => {
    if (!getRewardGrowthInsides?.[i]) return false
    return userInfo.rewardGrowthInside.gt(getRewardGrowthInsides[i])
  })

  const modal = useModalV2()

  const [triggerOnce, setTriggerOnce] = useState(false)

  const { harvesting, onHarvestAll } = useFarmsV3BatchHarvest()

  if (!triggerOnce && canHarvestToRetrigger?.length > 0) {
    setTriggerOnce(true)
    modal.onOpen()
  }

  return (
    <ModalV2 {...modal} closeOnOverlayClick>
      <Modal title="Harvest Reminder">
        <AtomBox>
          <Button
            disabled={harvesting}
            onClick={() => {
              onHarvestAll(canHarvestToRetrigger.map((userInfo) => userInfo.tokenId.toString()))
            }}
          >
            {harvesting ? 'Harvesting...' : 'Harvest'}
          </Button>
        </AtomBox>
      </Modal>
    </ModalV2>
  )
}
