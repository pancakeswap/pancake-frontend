import { useTranslation } from '@pancakeswap/localization'
import styled from 'styled-components'
import {
  AutoRow,
  Balance,
  BalanceInput,
  BalanceInputProps,
  Button,
  Card,
  Flex,
  FlexGap,
  Grid,
  Heading,
  Input,
  Text,
  TextField,
} from '@pancakeswap/uikit'
import BN from 'bignumber.js'
import { CurrencyInput } from 'components/CurrencyInput'
import useTokenBalance, { useBSCCakeBalance } from 'hooks/useTokenBalance'
import { CAKE } from '@pancakeswap/tokens'
import { formatBigInt, getFullDisplayBalance } from '@pancakeswap/utils/formatBalance'
import { ChainId } from '@pancakeswap/chains'
import { useCallback, useMemo, useState } from 'react'
import { useCakePrice } from 'hooks/useCakePrice'

const StyledMigrationCard = styled(Card)`
  align-self: start;
  background: ${({ theme }) => theme.colors.backgroundAlt};
`

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
        {t('Balance: %balance%', { balance: formatBigInt(cakeBalance) })}
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
        inputProps={{ style: { textAlign: 'left' }, disabled }}
        currencyValue={usdValue}
        unit={balance}
      />
      {!disabled && balance ? (
        <FlexGap justifyContent="space-between" flex={1} gap="4px">
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

export const Migrate = () => {
  const { t } = useTranslation()
  const [cakeValue, setCakeValue] = useState('0')
  const onCakeCurrencyChange = useCallback((value: string) => {
    setCakeValue(value)
  }, [])
  return (
    <StyledMigrationCard innerCardProps={{ padding: '24px' }}>
      <Heading scale="md">{t('Migrate to get veCAKE')}</Heading>

      <Grid gridTemplateColumns="1fr 1fr" mt={32}>
        <AutoRow alignSelf="start" gap="16px">
          <Text>{t('Your CAKE-BNB LP Tokens')}</Text>
          <CakeInput value={cakeValue} onUserInput={onCakeCurrencyChange} />
          <Button disabled width="100%">
            {t('Add CAKE')}
          </Button>
        </AutoRow>
        <AutoRow alignSelf="start">
          <Text>{t('Your CAKE-BNB LP Tokens')}</Text>
        </AutoRow>
      </Grid>
    </StyledMigrationCard>
  )
}
