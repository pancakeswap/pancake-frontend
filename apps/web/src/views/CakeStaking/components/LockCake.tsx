import { useTranslation } from '@pancakeswap/localization'
import {
  AtomBox,
  AutoColumn,
  Balance,
  Box,
  Card,
  CardHeader,
  Flex,
  Grid,
  Heading,
  Row,
  RowBetween,
  Text,
} from '@pancakeswap/uikit'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import BigNumber from 'bignumber.js'
import { useCakePrice } from 'hooks/useCakePrice'
import { useMemo } from 'react'
import styled from 'styled-components'
import { formatTime } from 'utils/formatTime'

dayjs.extend(relativeTime)

export enum StatingStatus {
  NotStaking = 'NotStaking',
  Staking = 'Staking',
  Expired = 'Expired',
  Migrate = 'Migrate',
}

const MyVeCakeCard = () => {
  // @todo @ChefJerry useHook
  const balance = 1253.48

  return (
    <Card isActive>
      <CardHeader>
        <RowBetween>
          <AutoColumn>
            <Heading color="text">My VeCAKE</Heading>
            <Balance fontSize="20px" color="textSubtle" value={balance} />
          </AutoColumn>
          <img srcSet="/images/cake-staking/token-vecake.png 2x" alt="token-vecake" />
        </RowBetween>
      </CardHeader>
      <LockedInfo />
      <Flex justifyContent="center">
        <img src="/images/cake-staking/my-cake-bunny.png" alt="my-cake-bunny" width="254px" />
      </Flex>
    </Card>
  )
}

export const StyledLockedInfo = styled(AtomBox)`
  margin: 24px;
  padding: 12px;
  border-radius: ${({ theme }) => theme.radii.default};
  border: 1px solid ${({ theme }) => theme.colors.cardBorder};
  background-color: ${({ theme }) => theme.colors.background};
`

const LockedInfo = () => {
  const { t } = useTranslation()

  const cakePriceBusd = useCakePrice()
  // @todo @ChefJerry useHook
  const cakeLocked = 1557.75

  const cakeLockedUsdValue = useMemo(() => {
    return new BigNumber(cakeLocked).times(cakePriceBusd).toNumber()
  }, [cakePriceBusd, cakeLocked])

  const unlockTime = dayjs().add(2, 'weeks')
  const unlockTimeToNow = dayjs(unlockTime).fromNow(true)

  return (
    <StyledLockedInfo>
      <RowBetween>
        <AutoColumn>
          <Text fontSize={12} color="textSubtle" textTransform="uppercase" bold>
            {t('cake locked')}
          </Text>
          <Balance value={cakeLocked} decimals={2} fontWeight={600} fontSize={20} />
          <Balance prefix="~" value={cakeLockedUsdValue} decimals={2} unit="USD" fontSize={12} />
        </AutoColumn>
        <AutoColumn>
          <Text fontSize={12} color="textSubtle" textTransform="uppercase" bold>
            {t('unlocks in')}
          </Text>
          <Text fontWeight={600} fontSize={20}>
            {unlockTimeToNow}
          </Text>
          <Text fontSize={12}>
            {t('on')} {formatTime(Number(unlockTime))}
          </Text>
        </AutoColumn>
      </RowBetween>
    </StyledLockedInfo>
  )
}

export const LockCake = () => {
  return (
    <Grid gridGap="24px" gridTemplateColumns="1fr 2fr">
      <MyVeCakeCard />
      <MyVeCakeCard />
    </Grid>
  )
}
