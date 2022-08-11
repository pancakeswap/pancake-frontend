import React, { useMemo } from 'react'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { useTranslation } from '@pancakeswap/localization'
import { Button, AutoRenewIcon } from '@pancakeswap/uikit'
import BigNumber from 'bignumber.js'
import { DeserializedPool, VaultKey } from 'state/types'
import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'
import { ToastDescriptionWithTx } from 'components/Toast'
import useCatchTxError from 'hooks/useCatchTxError'
import useToast from 'hooks/useToast'
import { useWeb3React } from '@web3-react/core'
import { vaultPoolConfig } from 'config/constants/pools'
import ifoPoolAbi from 'config/abi/ifoPool.json'
import cakeVaultAbi from 'config/abi/cakeVaultV2.json'
import { getContract } from 'utils/contractHelpers'
import { getFullDisplayBalance } from 'utils/formatBalance'
import { useVaultPoolByKeyV1, ifoPoolV1Contract, cakeVaultAddress } from 'views/Migration/hook/V1/Pool/useFetchIfoPool'
import { useFetchUserPools } from '../../../hook/V1/Pool/useFetchUserPools'
import useUnstakePool from '../../../hook/V1/Pool/useUnstakePool'

export interface UnstakeButtonProps {
  pool: DeserializedPool
}

const UnstakeButton: React.FC<React.PropsWithChildren<UnstakeButtonProps>> = ({ pool }) => {
  const { sousId, stakingToken, earningToken, userData, vaultKey } = pool
  const { t } = useTranslation()
  const { account } = useWeb3React()
  const { library } = useActiveWeb3React()
  const { fetchWithCatchTxError, loading: pendingTx } = useCatchTxError()
  const { callWithGasPrice } = useCallWithGasPrice()
  const { toastSuccess } = useToast()
  const { fetchUserPoolsData } = useFetchUserPools(account)

  const { vaultPoolData, fetchPoolData } = useVaultPoolByKeyV1(vaultKey)
  const { userShares } = vaultPoolData.userData

  const vaultPoolContract = useMemo(() => {
    return vaultKey === VaultKey.CakeVaultV1
      ? getContract(cakeVaultAbi, cakeVaultAddress, library.getSigner())
      : getContract(ifoPoolAbi, ifoPoolV1Contract, library.getSigner())
  }, [library, vaultKey])

  const { onUnstake } = useUnstakePool(sousId, pool.enableEmergencyWithdraw)

  const isNeedUnstake = vaultKey ? userShares?.gt(0) : new BigNumber(userData.stakedBalance).gt(0)

  const handleUnstake = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation()
    if (vaultKey) {
      onPresentVaultUnstake()
    } else {
      onPresentUnstake()
    }
  }

  const onPresentVaultUnstake = async () => {
    const receipt = await fetchWithCatchTxError(() => {
      return callWithGasPrice(vaultPoolContract, 'withdrawAll', undefined, {
        gasLimit: vaultPoolConfig[pool.vaultKey].gasLimit,
      })
    })

    if (receipt?.status) {
      toastSuccess(
        t('Unstaked!'),
        <ToastDescriptionWithTx txHash={receipt.transactionHash}>
          {t('Your earnings have also been harvested to your wallet')}
        </ToastDescriptionWithTx>,
      )
      fetchPoolData()
    }
  }

  const onPresentUnstake = async () => {
    const receipt = await fetchWithCatchTxError(() => {
      const stakedAmount = getFullDisplayBalance(userData.stakedBalance, stakingToken.decimals, stakingToken.decimals)
      return onUnstake(stakedAmount, stakingToken.decimals)
    })

    if (receipt?.status) {
      toastSuccess(
        `${t('Unstaked')}!`,
        <ToastDescriptionWithTx txHash={receipt.transactionHash}>
          {t('Your %symbol% earnings have also been harvested to your wallet!', {
            symbol: earningToken.symbol,
          })}
        </ToastDescriptionWithTx>,
      )
      fetchUserPoolsData()
    }
  }

  return (
    <>
      {pendingTx ? (
        <Button
          width="138px"
          marginLeft="auto"
          isLoading={pendingTx}
          endIcon={<AutoRenewIcon spin color="currentColor" />}
        >
          {t('Confirming')}
        </Button>
      ) : (
        <Button width="138px" marginLeft="auto" disabled={!isNeedUnstake} onClick={handleUnstake}>
          {isNeedUnstake ? t('Unstake All') : t('Unstaked')}
        </Button>
      )}
    </>
  )
}

export default UnstakeButton
