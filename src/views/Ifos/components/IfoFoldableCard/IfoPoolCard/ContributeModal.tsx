import React, { useState } from 'react'
import { useWeb3React } from '@web3-react/core'
import BigNumber from 'bignumber.js'
import { ethers } from 'ethers'
import { parseUnits } from 'ethers/lib/utils'
import { Modal, ModalBody, Text, Image, Button, BalanceInput, Flex } from '@pancakeswap/uikit'
import { PoolIds, Ifo } from 'config/constants/types'
import { WalletIfoData, PublicIfoData } from 'views/Ifos/types'
import { useTranslation } from 'contexts/Localization'
import { getBalanceAmount } from 'utils/formatBalance'
import { getAddress } from 'utils/addressHelpers'
import ApproveConfirmButtons from 'views/Profile/components/ApproveConfirmButtons'
import useApproveConfirmTransaction from 'hooks/useApproveConfirmTransaction'
import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'
import { DEFAULT_TOKEN_DECIMAL } from 'config'
import { useERC20 } from 'hooks/useContract'

interface Props {
  poolId: PoolIds
  ifo: Ifo
  publicIfoData: PublicIfoData
  walletIfoData: WalletIfoData
  userCurrencyBalance: BigNumber
  onSuccess: (amount: BigNumber) => void
  onDismiss?: () => void
}

const multiplierValues = [0.1, 0.25, 0.5, 0.75, 1]

// Default value for transaction setting, tweak based on BSC network congestion.
const gasPrice = parseUnits('10', 'gwei').toString()

const ContributeModal: React.FC<Props> = ({
  poolId,
  ifo,
  publicIfoData,
  walletIfoData,
  userCurrencyBalance,
  onDismiss,
  onSuccess,
}) => {
  const publicPoolCharacteristics = publicIfoData[poolId]
  const userPoolCharacteristics = walletIfoData[poolId]

  const { currency } = ifo
  const { limitPerUserInLP } = publicPoolCharacteristics
  const { amountTokenCommittedInLP } = userPoolCharacteristics
  const { contract } = walletIfoData
  const [value, setValue] = useState('')
  const { account } = useWeb3React()
  const { callWithGasPrice } = useCallWithGasPrice()
  const raisingTokenContract = useERC20(getAddress(currency.address))
  const { t } = useTranslation()
  const valueWithTokenDecimals = new BigNumber(value).times(DEFAULT_TOKEN_DECIMAL)

  const { isApproving, isApproved, isConfirmed, isConfirming, handleApprove, handleConfirm } =
    useApproveConfirmTransaction({
      onRequiresApproval: async () => {
        try {
          const response = await raisingTokenContract.allowance(account, contract.address)
          const currentAllowance = new BigNumber(response.toString())
          return currentAllowance.gt(0)
        } catch (error) {
          return false
        }
      },
      onApprove: () => {
        return callWithGasPrice(raisingTokenContract, 'approve', [contract.address, ethers.constants.MaxUint256], {
          gasPrice,
        })
      },
      onConfirm: () => {
        return callWithGasPrice(
          contract,
          'depositPool',
          [valueWithTokenDecimals.toString(), poolId === PoolIds.poolBasic ? 0 : 1],
          {
            gasPrice,
          },
        )
      },
      onSuccess: async () => {
        await onSuccess(valueWithTokenDecimals)
        onDismiss()
      },
    })

  const maximumLpCommitable = (() => {
    if (limitPerUserInLP.isGreaterThan(0)) {
      return limitPerUserInLP.minus(amountTokenCommittedInLP).isLessThanOrEqualTo(userCurrencyBalance)
        ? limitPerUserInLP
        : userCurrencyBalance
    }
    return userCurrencyBalance
  })()

  return (
    <Modal title={t('Contribute %symbol%', { symbol: currency.symbol })} onDismiss={onDismiss}>
      <ModalBody maxWidth="320px">
        {limitPerUserInLP.isGreaterThan(0) && (
          <Flex justifyContent="space-between" mb="16px">
            <Text>{t('Max. LP token entry')}</Text>
            <Text>{getBalanceAmount(limitPerUserInLP, currency.decimals).toString()}</Text>
          </Flex>
        )}
        <Flex justifyContent="space-between" mb="8px">
          <Text>{t('Commit')}:</Text>
          <Flex flexGrow={1} justifyContent="flex-end">
            <Image
              src={`/images/farms/${currency.symbol.split(' ')[0].toLocaleLowerCase()}.svg`}
              width={24}
              height={24}
            />
            <Text>{currency.symbol}</Text>
          </Flex>
        </Flex>
        <BalanceInput
          value={value}
          currencyValue={publicIfoData.currencyPriceInUSD.times(value || 0).toFixed(2)}
          onUserInput={setValue}
          isWarning={valueWithTokenDecimals.isGreaterThan(maximumLpCommitable)}
          decimals={currency.decimals}
          mb="8px"
        />
        <Text color="textSubtle" textAlign="right" fontSize="12px" mb="16px">
          {t('Balance: %balance%', {
            balance: getBalanceAmount(userCurrencyBalance, currency.decimals).toString(),
          })}
        </Text>
        <Flex justifyContent="space-between" mb="16px">
          {multiplierValues.map((multiplierValue, index) => (
            <Button
              key={multiplierValue}
              scale="xs"
              variant="tertiary"
              onClick={() => setValue(getBalanceAmount(maximumLpCommitable.times(multiplierValue)).toString())}
              mr={index < multiplierValues.length - 1 ? '8px' : 0}
            >
              {multiplierValue * 100}%
            </Button>
          ))}
        </Flex>
        <Text color="textSubtle" fontSize="12px" mb="24px">
          {t(
            'If you don’t commit enough LP tokens, you may not receive any IFO tokens at all and will only receive a full refund of your LP tokens.',
          )}
        </Text>
        <ApproveConfirmButtons
          isApproveDisabled={isConfirmed || isConfirming || isApproved}
          isApproving={isApproving}
          isConfirmDisabled={
            !isApproved || isConfirmed || valueWithTokenDecimals.isNaN() || valueWithTokenDecimals.eq(0)
          }
          isConfirming={isConfirming}
          onApprove={handleApprove}
          onConfirm={handleConfirm}
        />
      </ModalBody>
    </Modal>
  )
}

export default ContributeModal
