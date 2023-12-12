import { ChainId } from '@pancakeswap/chains'
import { useTranslation } from '@pancakeswap/localization'
import { CAKE } from '@pancakeswap/tokens'
import {
  AutoRow,
  Balance,
  BalanceInput,
  BalanceInputProps,
  Box,
  Button,
  Flex,
  FlexGap,
  Text,
  TokenImage,
} from '@pancakeswap/uikit'
import { formatBigInt, getFullDisplayBalance } from '@pancakeswap/utils/formatBalance'
import BN from 'bignumber.js'
import { useCakePrice } from 'hooks/useCakePrice'
import { useAtom, useAtomValue } from 'jotai'
import { useCallback, useMemo, useState } from 'react'
import { cakeLockAmountAtom } from 'state/vecake/atoms'
import { useBSCCakeBalance } from '../hooks/useBSCCakeBalance'
import { useWriteApproveAndIncreaseLockAmountCallback } from '../hooks/useContractWrite'
import { LockCakeDataSet } from './DataSet'

const percentShortcuts = [25, 50, 75]

const CakeInput: React.FC<{
  value: BalanceInputProps['value']
  onUserInput: BalanceInputProps['onUserInput']
  disabled?: boolean
}> = ({ value, onUserInput, disabled }) => {
  const { t } = useTranslation()
  const cakeUsdPrice = useCakePrice()
  const cakeUsdValue = useMemo(() => {
    return cakeUsdPrice && value ? cakeUsdPrice.times(value).toNumber() : 0
  }, [cakeUsdPrice, value])
  const [percent, setPercent] = useState<number | null>(null)
  const _cakeBalance = useBSCCakeBalance()
  const cakeBalance = BigInt(_cakeBalance.toString())

  const onInput = useCallback(
    (input: string) => {
      setPercent(null)
      onUserInput(input)
    },
    [onUserInput],
  )

  const handlePercentChange = useCallback(
    (p: number) => {
      if (p > 0) {
        onUserInput(getFullDisplayBalance(new BN(cakeBalance.toString()).multipliedBy(p).dividedBy(100), 18, 18))
      } else {
        onUserInput('')
      }
      setPercent(p)
    },
    [cakeBalance, onUserInput, setPercent],
  )

  const balance = (
    <Flex>
      <Text textAlign="left" color="textSubtle" ml="4px" fontSize="12px">
        {t('Balance: %balance%', { balance: formatBigInt(cakeBalance, 2) })}
      </Text>
    </Flex>
  )

  const usdValue = (
    <Flex>
      <Balance mt={1} fontSize="12px" color="textSubtle" decimals={2} value={cakeUsdValue} unit=" USD" prefix="~" />
    </Flex>
  )

  return (
    <>
      <BalanceInput
        width="100%"
        value={value}
        onUserInput={onInput}
        inputProps={{ style: { textAlign: 'left', height: '20px' }, disabled }}
        currencyValue={usdValue}
        unit={balance}
      />
      {!disabled && balance ? (
        <FlexGap justifyContent="space-between" flexWrap="wrap" gap="4px" width="100%">
          {percentShortcuts.map((p) => {
            return (
              <Button
                key={p}
                style={{ flex: 1 }}
                scale="sm"
                variant={p === percent ? 'primary' : 'tertiary'}
                onClick={() => handlePercentChange(p)}
              >
                {`${p}%`}
              </Button>
            )
          })}
          <Button
            scale="sm"
            style={{ flex: 1 }}
            variant={percent === 100 ? 'primary' : 'tertiary'}
            onClick={() => handlePercentChange(100)}
          >
            {t('Max')}
          </Button>
        </FlexGap>
      ) : null}
    </>
  )
}

export const LockCakeForm: React.FC<{
  // show input field only
  fieldOnly?: boolean
  disabled?: boolean
}> = ({ fieldOnly, disabled }) => {
  const { t } = useTranslation()
  const [value, onChange] = useAtom(cakeLockAmountAtom)

  return (
    <AutoRow alignSelf="start" gap="16px">
      <FlexGap gap="8px" alignItems="center" height="40px">
        <Box width={40}>
          <TokenImage
            src={`https://pancakeswap.finance/images/tokens/${CAKE[ChainId.BSC].address}.png`}
            height={40}
            width={40}
            title={CAKE[ChainId.BSC].symbol}
          />
        </Box>
        <FlexGap gap="4px">
          <Text color="textSubtle" textTransform="uppercase" fontSize={16} bold>
            {t('add')}
          </Text>
          <Text color="secondary" textTransform="uppercase" fontSize={16} bold>
            {t('stake')}
          </Text>
        </FlexGap>
      </FlexGap>
      <CakeInput value={value} onUserInput={onChange} disabled={disabled} />

      {fieldOnly ? null : (
        <>
          {disabled ? null : <LockCakeDataSet />}

          <SubmitLockButton />
        </>
      )}
    </AutoRow>
  )
}

const SubmitLockButton = () => {
  const { t } = useTranslation()
  const cakeLockAmount = useAtomValue(cakeLockAmountAtom)
  const disabled = useMemo(() => !cakeLockAmount || cakeLockAmount === '0', [cakeLockAmount])
  const increaseLockAmount = useWriteApproveAndIncreaseLockAmountCallback()

  return (
    <Button disabled={disabled} width="100%" onClick={increaseLockAmount}>
      {t('Add CAKE')}
    </Button>
  )
}
