import { useTranslation } from '@pancakeswap/localization'
import styled from 'styled-components'
import {
  AutoColumn,
  AutoRow,
  Balance,
  BalanceInput,
  BalanceInputProps,
  Box,
  Button,
  Card,
  Column,
  Flex,
  FlexGap,
  Grid,
  Heading,
  Input,
  Text,
  TextField,
  TokenImage,
  Image,
  TooltipText,
} from '@pancakeswap/uikit'
import BN from 'bignumber.js'
import { CurrencyInput } from 'components/CurrencyInput'
import useTokenBalance, { useBSCCakeBalance } from 'hooks/useTokenBalance'
import { CAKE } from '@pancakeswap/tokens'
import { formatBigInt, getFullDisplayBalance } from '@pancakeswap/utils/formatBalance'
import { ChainId } from '@pancakeswap/chains'
import { useCallback, useMemo, useState } from 'react'
import { useCakePrice } from 'hooks/useCakePrice'
import { Tooltips } from '../Tooltips'

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

const weeks = [1, 5, 10, 25, 52]
const WeekInput: React.FC<{
  value: BalanceInputProps['value']
  onUserInput: BalanceInputProps['onUserInput']
  disabled?: boolean
}> = ({ value, onUserInput, disabled }) => {
  const { t } = useTranslation()
  const handleWeekSelect = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      const { week } = e.currentTarget.dataset
      if (week) {
        onUserInput(week)
      }
    },
    [onUserInput],
  )
  return (
    <>
      <BalanceInput
        width="100%"
        inputProps={{ style: { textAlign: 'left', marginTop: '1px', marginBottom: '1px' }, disabled }}
        value={value}
        onUserInput={onUserInput}
        unit={t('Weeks')}
      />
      <FlexGap justifyContent="space-between" gap="4px" width="100%">
        {weeks.map((week) => (
          <Button
            key={week}
            data-week={week}
            disabled={disabled}
            onClick={handleWeekSelect}
            scale="sm"
            style={{ flex: 1 }}
            variant={String(week) === value ? 'subtle' : 'light'}
          >
            {t('%week%W', { week })}
          </Button>
        ))}
      </FlexGap>
    </>
  )
}

export const Migrate = () => {
  const { t } = useTranslation()
  const [cakeValue, setCakeValue] = useState('0')
  const [duration, setDuration] = useState('0')
  const onCakeCurrencyChange = useCallback((value: string) => {
    setCakeValue(value)
  }, [])
  return (
    <StyledMigrationCard innerCardProps={{ padding: '24px' }}>
      <Heading scale="md">{t('Migrate to get veCAKE')}</Heading>

      <Grid gridTemplateColumns="1fr 1fr" mt={32} gridColumnGap="24px">
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

          <DataBox gap="8px">
            <DataCardHead />
            <DataRow label={t('CAKE to be locked')} value="1,438.45" />
            <DataRow
              label={
                <Tooltips content={t('@todo')}>
                  <TooltipText fontSize={12} bold color="textSubtle" textTransform="uppercase">
                    {t('unlock on')}
                  </TooltipText>
                </Tooltips>
              }
              value="1,438.45"
            />
          </DataBox>

          <Button disabled width="100%">
            {t('Add CAKE')}
          </Button>
        </AutoRow>
        <AutoRow alignSelf="start" gap="16px">
          <FlexGap gap="8px" alignItems="center">
            <Box width={40}>
              <Image src="/images/cake-staking/lock.png" height={40} width={40} />
            </Box>
            <FlexGap gap="4px">
              <Text color="textSubtle" textTransform="uppercase" fontSize={16} bold>
                {t('add')}
              </Text>
              <Text color="secondary" textTransform="uppercase" fontSize={16} bold>
                {t('duration')}
              </Text>
            </FlexGap>
          </FlexGap>

          <WeekInput value={duration} onUserInput={setDuration} />

          <DataBox gap="8px">
            <DataCardHead />
            <DataRow
              label={
                <Tooltips content={t('@todo')}>
                  <TooltipText fontSize={12} bold color="textSubtle" textTransform="uppercase">
                    {t('factor')}
                  </TooltipText>
                </Tooltips>
              }
              value="1,438.45"
            />
            <DataRow
              label={
                <Tooltips content={t('@todo')}>
                  <TooltipText fontSize={12} bold color="textSubtle" textTransform="uppercase">
                    {t('unlock on')}
                  </TooltipText>
                </Tooltips>
              }
              value="1,438.45"
            />
          </DataBox>

          <Button disabled width="100%">
            {t('Extend Lock')}
          </Button>
        </AutoRow>
      </Grid>
    </StyledMigrationCard>
  )
}

const DataBox = styled(AutoRow)`
  width: 100%;
  padding: 12px;
  border-radius: ${({ theme }) => theme.radii.default};
  border: 1px solid ${({ theme }) => theme.colors.cardBorder};
  background-color: ${({ theme }) => theme.colors.background};
`

const DataRow: React.FC<{
  label?: React.ReactNode
  value?: React.ReactNode
}> = ({ label, value }) => {
  return (
    <Flex justifyContent="space-between" width="100%" alignItems="center">
      <Text fontSize={12} bold color="textSubtle">
        {label}
      </Text>
      <Text fontSize={16} textAlign="right">
        {value}
      </Text>
    </Flex>
  )
}

const DataCardHead = () => {
  return (
    <DataRow
      label={
        <FlexGap gap="4px">
          <img src="/images/cake-staking/token-vecake.png" alt="token-vecake" width="24px" />
          <Text fontSize="14px" bold>
            veCAKE
          </Text>
        </FlexGap>
      }
      value={
        <Text fontSize="14px" bold>
          276.625
        </Text>
      }
    />
  )
}
