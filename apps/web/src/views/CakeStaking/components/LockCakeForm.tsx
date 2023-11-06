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
  TooltipText,
} from '@pancakeswap/uikit'
import { formatBigInt, getFullDisplayBalance } from '@pancakeswap/utils/formatBalance'
import BN from 'bignumber.js'
import { useCakePrice } from 'hooks/useCakePrice'
import useTokenBalance, { useBSCCakeBalance } from 'hooks/useTokenBalance'
import { useCallback, useMemo, useState } from 'react'
import { DataBox, DataHeader, DataRow } from './DataSet/DataBox'
import { Tooltips } from './Tooltips'
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
    return cakeUsdPrice ? cakeUsdPrice.times(value).toNumber() : 0
  }, [cakeUsdPrice, value])
  const [percent, setPercent] = useState<number | null>(null)
  // const { balance: cakeBalance } = useBSCCakeBalance()
  const { balance: _cakeBalance } = useTokenBalance(CAKE[ChainId.BSC_TESTNET].address)
  const cakeBalance = BigInt(_cakeBalance.toString())

  const handlePercentChange = useCallback(
    (p: number) => {
      if (p > 0) {
        onUserInput(getFullDisplayBalance(new BN(cakeBalance.toString()).multipliedBy(p).dividedBy(100)))
      } else {
        onUserInput('')
      }
      setPercent(p)
    },
    [cakeBalance, onUserInput, setPercent],
  )

  const balance = cakeBalance ? (
    <Flex>
      <Text textAlign="left" color="textSubtle" ml="4px">
        {t('Balance: %balance%', { balance: formatBigInt(cakeBalance, 2) })}
      </Text>
    </Flex>
  ) : null

  const usdValue = (
    <Flex>
      <Balance fontSize="12px" color="textSubtle" decimals={2} value={cakeUsdValue} unit=" USD" prefix="~" />
    </Flex>
  )

  return (
    <>
      <BalanceInput
        width="100%"
        value={value}
        onUserInput={onUserInput}
        inputProps={{ style: { textAlign: 'left', height: '20px' }, disabled }}
        currencyValue={usdValue}
        unit={balance}
      />
      {!disabled && balance ? (
        <FlexGap justifyContent="space-between" gap="4px" width="100%">
          {percentShortcuts.map((p) => {
            return (
              <Button
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
}> = ({ fieldOnly }) => {
  const { t } = useTranslation()
  const [cakeValue, setCakeValue] = useState('0')
  const onCakeCurrencyChange = useCallback((value: string) => {
    setCakeValue(value)
  }, [])
  return (
    <AutoRow alignSelf="start" gap="16px">
      <FlexGap gap="8px" alignItems="center">
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
      <CakeInput value={cakeValue} onUserInput={onCakeCurrencyChange} />

      {fieldOnly ? null : (
        <>
          <LockCakeDataSet />

          <Button disabled width="100%">
            {t('Add CAKE')}
          </Button>
        </>
      )}
    </AutoRow>
  )
}
