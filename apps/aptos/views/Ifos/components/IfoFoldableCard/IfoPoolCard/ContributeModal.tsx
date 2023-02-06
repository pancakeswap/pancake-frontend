import { useTranslation } from '@pancakeswap/localization'
import {
  BalanceInput,
  Box,
  Button,
  Flex,
  Image,
  Link,
  Modal,
  ModalBody,
  Text,
  IfoHasVestingNotice,
} from '@pancakeswap/uikit'
import { formatNumber, getBalanceAmount, getDecimalAmount } from '@pancakeswap/utils/formatBalance'
import BigNumber from 'bignumber.js'
import { ConfirmButton } from 'components/ConfirmButton'
import splitTypeTag from 'utils/splitTypeTag'
import { Ifo, PoolIds } from 'config/constants/types'
import { useConfirmTransaction } from 'hooks/useConfirmTransaction'
import { useMemo, useState } from 'react'
import { ifoDeposit } from 'views/Ifos/generated/ifo'
import { useIfoPool } from 'views/Ifos/hooks/useIfoPool'
import { PublicIfoData, WalletIfoData } from 'views/Ifos/types'
import useSimulationAndSendTransaction from 'hooks/useSimulationAndSendTransaction'

interface Props {
  poolId: PoolIds
  ifo: Ifo
  publicIfoData: PublicIfoData
  walletIfoData: WalletIfoData
  userCurrencyBalance: BigNumber
  onSuccess: (amount: BigNumber, txHash: string) => void
  onDismiss?: () => void
}

const multiplierValues = [0.1, 0.25, 0.5, 0.75, 1]

const ContributeModal: React.FC<React.PropsWithChildren<Props>> = ({
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

  const { currency, articleUrl } = ifo
  const { limitPerUserInLP, vestingInformation } = publicPoolCharacteristics
  const { amountTokenCommittedInLP } = userPoolCharacteristics
  const { t } = useTranslation()
  const executeTransaction = useSimulationAndSendTransaction()
  const pool = useIfoPool(ifo)

  const [value, setValue] = useState('')

  const valueWithTokenDecimals = useMemo(
    () => getDecimalAmount(new BigNumber(value), currency.decimals),
    [currency.decimals, value],
  )

  const hasLimit = limitPerUserInLP.isGreaterThan(0)

  const label = t('Max. token entry')

  const maximumTokenEntry = useMemo(() => {
    return limitPerUserInLP.minus(amountTokenCommittedInLP)
  }, [amountTokenCommittedInLP, limitPerUserInLP])

  // include user balance for input
  const maximumTokenCommittable = useMemo(() => {
    return userCurrencyBalance
  }, [userCurrencyBalance])

  const isWarning = useMemo(() => {
    return (
      valueWithTokenDecimals.isGreaterThan(userCurrencyBalance) ||
      (hasLimit && valueWithTokenDecimals.isGreaterThan(maximumTokenEntry))
    )
  }, [maximumTokenEntry, hasLimit, userCurrencyBalance, valueWithTokenDecimals])

  const { isConfirmed, isConfirming, handleConfirm } = useConfirmTransaction({
    onConfirm: () => {
      const [raisingCoin, offeringCoin, uid] = splitTypeTag(pool?.type)

      const payload = ifoDeposit([valueWithTokenDecimals.toFixed()], [raisingCoin, offeringCoin, uid])

      return executeTransaction(payload)
    },
    onSuccess: async ({ response }) => {
      onSuccess(valueWithTokenDecimals, response.hash)
      onDismiss?.()
    },
  })

  const isConfirmDisabled = useMemo(() => {
    return isConfirmed || valueWithTokenDecimals.isNaN() || valueWithTokenDecimals.eq(0) || isWarning || !pool?.data
  }, [isConfirmed, isWarning, pool, valueWithTokenDecimals])

  return (
    <Modal title={t('Contribute %symbol%', { symbol: currency.symbol })} onDismiss={onDismiss}>
      <ModalBody maxWidth={['100%', '100%', '100%', '360px']}>
        <Box p="2px">
          {hasLimit && (
            <Flex justifyContent="space-between" mb="16px">
              <Text>{label}:</Text>
              <Text>{`${formatNumber(getBalanceAmount(maximumTokenEntry, currency.decimals).toNumber(), 3, 3)} ${
                ifo.currency.symbol
              }`}</Text>
            </Flex>
          )}
          <Flex justifyContent="space-between" mb="8px">
            <Text>{t('Commit')}:</Text>
            <Flex flexGrow={1} justifyContent="flex-end">
              <Image
                src={
                  ifo.currency.symbol === 'CAKE'
                    ? '/images/cake.svg'
                    : `/images/farms/${currency.symbol.split(' ')[0].toLowerCase()}.svg`
                }
                width={24}
                height={24}
              />
              <Text ml="4px">{currency.symbol}</Text>
            </Flex>
          </Flex>
          <BalanceInput
            value={value}
            currencyValue={`${publicIfoData.currencyPriceInUSD.times(value || 0).toFixed(2)} USD`}
            onUserInput={setValue}
            isWarning={isWarning}
            decimals={currency.decimals}
            onBlur={() => {
              if (isWarning) {
                // auto adjust to max value
                setValue(getBalanceAmount(maximumTokenCommittable).toString())
              }
            }}
            mb="8px"
          />
          {isWarning && (
            <Text
              color={valueWithTokenDecimals.isGreaterThan(userCurrencyBalance) ? 'failure' : 'warning'}
              textAlign="right"
              fontSize="12px"
              mb="8px"
            >
              {valueWithTokenDecimals.isGreaterThan(userCurrencyBalance)
                ? t('Insufficient Balance')
                : t('Exceeded max CAKE entry')}
            </Text>
          )}
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
                onClick={() =>
                  setValue(
                    getBalanceAmount(maximumTokenCommittable.times(multiplierValue), currency.decimals).toFixed(
                      currency.decimals,
                      BigNumber.ROUND_DOWN,
                    ),
                  )
                }
                mr={index < multiplierValues.length - 1 ? '8px' : 0}
              >
                {multiplierValue * 100}%
              </Button>
            ))}
          </Flex>
          {(vestingInformation?.percentage ?? 0) > 0 && <IfoHasVestingNotice url={articleUrl} />}
          <Text color="textSubtle" fontSize="12px" mb="24px">
            {t(
              'If you don’t commit enough CAKE, you may not receive a meaningful amount of IFO tokens, or you may not receive any IFO tokens at all.',
            )}
            <Link
              fontSize="12px"
              display="inline"
              href="https://docs.pancakeswap.finance/products/ifo-initial-farm-offering"
              external
            >
              {t('Read more')}
            </Link>
          </Text>
          <ConfirmButton isConfirmDisabled={isConfirmDisabled} isConfirming={isConfirming} onConfirm={handleConfirm} />
        </Box>
      </ModalBody>
    </Modal>
  )
}

export default ContributeModal
