import { useMemo } from 'react'
import { Box, Text, Flex, Pool } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import styled from 'styled-components'
import BigNumber from 'bignumber.js'
import { usePriceCakeUSD } from 'state/farms/hooks'
import { DeserializedLockedVaultUser } from 'state/types'
import { Token } from '@pancakeswap/sdk'
import { BIG_ZERO } from '@pancakeswap/utils/bigNumber'
import Actions from 'views/TradingReward/components/YourTradingReward/Actions'
import { formatNumber } from '@pancakeswap/utils/formatBalance'
import useUserDataInVaultPresenter from 'views/Pools/components/LockedPool/hooks/useUserDataInVaultPresenter'
import formatSecondsToWeeks from 'views/Pools/components/utils/formatSecondsToWeeks'
import { Incentives } from 'views/TradingReward/hooks/useAllTradingRewardPair'
import { ONE_WEEK_DEFAULT } from '@pancakeswap/pools'

const Container = styled(Flex)`
  justify-content: space-between;
  border-top: ${({ theme }) => `solid 1px ${theme.colors.cardBorder}`};
`

const bunnyHeadMain = `"data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAyOCAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3QgeD0iMSIgeT0iMTkiIHdpZHRoPSIxNyIgaGVpZ2h0PSIxMSIgZmlsbD0iIzFGQzdENCIvPgo8cGF0aCBkPSJNOS41MDcgMjQuNzA2QzguMTQ2MzUgMjYuMDY2NiA5LjczNzk1IDI4LjIzMTMgMTEuNzU1NSAzMC4yNDg5QzEzLjc3MzEgMzIuMjY2NSAxNS45Mzc4IDMzLjg1ODEgMTcuMjk4NCAzMi40OTc0QzE4LjY1OTEgMzEuMTM2OCAxNy45Njg1IDI4LjA3MTEgMTUuOTUwOSAyNi4wNTM1QzEzLjkzMzMgMjQuMDM1OSAxMC44Njc2IDIzLjM0NTMgOS41MDcgMjQuNzA2WiIgZmlsbD0iIzFGQzdENCIvPgo8cGF0aCBkPSJNMTUuNTA3IDIyLjcwNkMxNC4xNDYzIDI0LjA2NjYgMTUuNzM3OSAyNi4yMzEzIDE3Ljc1NTUgMjguMjQ4OUMxOS43NzMxIDMwLjI2NjUgMjEuOTM3OCAzMS44NTgxIDIzLjI5ODQgMzAuNDk3NEMyNC42NTkxIDI5LjEzNjggMjMuOTY4NSAyNi4wNzExIDIxLjk1MDkgMjQuMDUzNUMxOS45MzMzIDIyLjAzNTkgMTYuODY3NiAyMS4zNDUzIDE1LjUwNyAyMi43MDZaIiBmaWxsPSIjMUZDN0Q0Ii8+CjxnIGZpbHRlcj0idXJsKCNmaWx0ZXIwX2QpIj4KPHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik0xNC4xNDYgNi43NTE1OUMxNC4yMTA1IDcuMTA4OTYgMTQuMjcwMyA3LjQ4MTMxIDE0LjMyODEgNy44NjE2NEMxNC4yMTg5IDcuODU4NjUgMTQuMTA5NSA3Ljg1NzE0IDE0IDcuODU3MTRDMTMuMzgwMyA3Ljg1NzE0IDEyLjc2NDggNy45MDUzOSAxMi4xNTkgNy45OTc3OUMxMS44NzkgNy40MTQ1OCAxMS41NTQ3IDYuODIyNDYgMTEuMTg3MiA2LjIzMTQ1QzguNjk4OTcgMi4yMjk0NyA2LjUzODI2IDEuOTg2NzkgNC42Nzg4MiAyLjk4MzY2QzIuODE5MzggMy45ODA1MiAyLjg1NjI4IDYuNjc2NDQgNS4yNjY5NiA5LjQwNTM4QzUuNTgwNzYgOS43NjA2MSA1LjkwMDk3IDEwLjEzOTggNi4yMjQ3IDEwLjUyODZDMy42OTAxMyAxMi40NjU5IDIgMTUuMjY0NCAyIDE4LjI2OTVDMiAyMy44MjkyIDcuNzg1MTggMjUgMTQgMjVDMjAuMjE0OCAyNSAyNiAyMy44MjkyIDI2IDE4LjI2OTVDMjYgMTQuODY1OCAyMy44MzE4IDExLjcyNzIgMjAuNzI0MyA5LjgwNDc2QzIwLjkwMjIgOC44NjA0NCAyMSA3LjgzMDE5IDIxIDYuNzUxNTlDMjEgMi4xOTYxMiAxOS4yNTQ5IDEgMTcuMTAyMiAxQzE0Ljk0OTUgMSAxMy41MjYxIDMuMzE4NDcgMTQuMTQ2IDYuNzUxNTlaIiBmaWxsPSJ1cmwoI3BhaW50MF9saW5lYXJfYnVubnloZWFkX21haW4pIi8+CjwvZz4KPGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMikiPgo8cGF0aCBkPSJNMTIuNzI4NCAxNi40NDQ2QzEyLjc5NiAxNy4zMTQ5IDEyLjQ0NDYgMTkuMDU1NiAxMC40OTggMTkuMDU1NiIgc3Ryb2tlPSIjNDUyQTdBIiBzdHJva2UtbGluZWNhcD0icm91bmQiLz4KPHBhdGggZD0iTTEyLjc0NTcgMTYuNDQ0NkMxMi42NzgxIDE3LjMxNDkgMTMuMDI5NiAxOS4wNTU2IDE0Ljk3NjEgMTkuMDU1NiIgc3Ryb2tlPSIjNDUyQTdBIiBzdHJva2UtbGluZWNhcD0icm91bmQiLz4KPHBhdGggZD0iTTkgMTQuNUM5IDE1LjYwNDYgOC41NTIyOCAxNiA4IDE2QzcuNDQ3NzIgMTYgNyAxNS42MDQ2IDcgMTQuNUM3IDEzLjM5NTQgNy40NDc3MiAxMyA4IDEzQzguNTUyMjggMTMgOSAxMy4zOTU0IDkgMTQuNVoiIGZpbGw9IiM0NTJBN0EiLz4KPHBhdGggZD0iTTE4IDE0LjVDMTggMTUuNjA0NiAxNy41NTIzIDE2IDE3IDE2QzE2LjQ0NzcgMTYgMTYgMTUuNjA0NiAxNiAxNC41QzE2IDEzLjM5NTQgMTYuNDQ3NyAxMyAxNyAxM0MxNy41NTIzIDEzIDE4IDEzLjM5NTQgMTggMTQuNVoiIGZpbGw9IiM0NTJBN0EiLz4KPC9nPgo8ZGVmcz4KPGZpbHRlciBpZD0iZmlsdGVyMF9kIj4KPGZlRmxvb2QgZmxvb2Qtb3BhY2l0eT0iMCIgcmVzdWx0PSJCYWNrZ3JvdW5kSW1hZ2VGaXgiLz4KPGZlQ29sb3JNYXRyaXggaW49IlNvdXJjZUFscGhhIiB0eXBlPSJtYXRyaXgiIHZhbHVlcz0iMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMTI3IDAiLz4KPGZlT2Zmc2V0IGR5PSIxIi8+CjxmZUdhdXNzaWFuQmx1ciBzdGREZXZpYXRpb249IjEiLz4KPGZlQ29sb3JNYXRyaXggdHlwZT0ibWF0cml4IiB2YWx1ZXM9IjAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAuNSAwIi8+CjxmZUJsZW5kIG1vZGU9Im5vcm1hbCIgaW4yPSJCYWNrZ3JvdW5kSW1hZ2VGaXgiIHJlc3VsdD0iZWZmZWN0MV9kcm9wU2hhZG93Ii8+CjxmZUJsZW5kIG1vZGU9Im5vcm1hbCIgaW49IlNvdXJjZUdyYXBoaWMiIGluMj0iZWZmZWN0MV9kcm9wU2hhZG93IiByZXN1bHQ9InNoYXBlIi8+CjwvZmlsdGVyPgo8bGluZWFyR3JhZGllbnQgaWQ9InBhaW50MF9saW5lYXJfYnVubnloZWFkX21haW4iIHgxPSIxNCIgeTE9IjEiIHgyPSIxNCIgeTI9IjI1IiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+CjxzdG9wIHN0b3AtY29sb3I9IiM1M0RFRTkiLz4KPHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjMUZDN0Q0Ii8+CjwvbGluZWFyR3JhZGllbnQ+CjwvZGVmcz4KPC9zdmc+Cg=="`
const bunnyButt = `"data:image/svg+xml,%3Csvg width='15' height='32' viewBox='0 0 15 32' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M9.58803 20.8649C7.72935 21.3629 8.02539 24.0334 8.76388 26.7895C9.50238 29.5456 10.5812 32.0062 12.4399 31.5082C14.2986 31.0102 15.2334 28.0099 14.4949 25.2538C13.7564 22.4978 11.4467 20.3669 9.58803 20.8649Z' fill='%230098A1'/%3E%3Cpath d='M1 24.4516C1 20.8885 3.88849 18 7.45161 18H15V28H4.54839C2.58867 28 1 26.4113 1 24.4516Z' fill='%231FC7D4'/%3E%3Cpath d='M6.11115 17.2246C6.79693 18.4124 5.77784 19.3343 4.52793 20.0559C3.27802 20.7776 1.97011 21.1992 1.28433 20.0114C0.598546 18.8236 1.1635 17.1151 2.41341 16.3935C3.66332 15.6718 5.42537 16.0368 6.11115 17.2246Z' fill='%2353DEE9'/%3E%3Cpath d='M1.64665 23.6601C0.285995 25.0207 1.87759 27.1854 3.89519 29.203C5.91279 31.2206 8.07743 32.8122 9.43808 31.4515C10.7987 30.0909 10.1082 27.0252 8.09058 25.0076C6.07298 22.99 3.0073 22.2994 1.64665 23.6601Z' fill='%231FC7D4'/%3E%3C/svg%3E"`

export const BarProgress = styled(Box)`
  background-color: ${({ theme }) => theme.colors.primary};
  height: 9px;
  position: absolute;
  top: 18px;
  left: 15px;
`
export const BunnyHead = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  width: 24px;
  height: 32px;
  z-index: 1;
  background: url(${bunnyHeadMain}) no-repeat;
`

export const BunnyButt = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  background: url(${bunnyButt}) no-repeat;
  height: 32px;
  width: 15px;
  z-index: 1;
`

interface NoCakeLockedOrExtendLockProps {
  pool: Pool.DeserializedPool<Token>
  userData: DeserializedLockedVaultUser
  incentives: Incentives
  isLockPosition: boolean
  isValidLockDuration: boolean
  thresholdLockTime: number
}

const NoCakeLockedOrExtendLock: React.FC<React.PropsWithChildren<NoCakeLockedOrExtendLockProps>> = ({
  pool,
  userData,
  incentives,
  isLockPosition,
  isValidLockDuration,
  thresholdLockTime,
}) => {
  const { t } = useTranslation()
  const cakePriceBusd = usePriceCakeUSD()
  const { stakingToken, userData: poolUserData } = pool ?? {}
  const {
    lockEndTime,
    lockStartTime,
    balance: { cakeAsBigNumber, cakeAsNumberBalance, cakeAsDisplayBalance },
  } = userData

  const currentBalance = useMemo(
    () => (poolUserData?.stakingTokenBalance ? new BigNumber(poolUserData?.stakingTokenBalance ?? '0') : BIG_ZERO),
    [poolUserData],
  )

  const { remainingTime, secondDuration } = useUserDataInVaultPresenter({
    lockEndTime,
    lockStartTime,
  })

  const isOnlyNeedExtendLock = useMemo(
    () => isLockPosition && cakeAsBigNumber.gt(0) && !isValidLockDuration,
    [isLockPosition, cakeAsBigNumber, isValidLockDuration],
  )

  const cakePrice = useMemo(
    () => new BigNumber(cakeAsNumberBalance).times(cakePriceBusd).toNumber(),
    [cakePriceBusd, cakeAsNumberBalance],
  )

  const minLockWeekInSeconds = useMemo(() => {
    const currentTime = new Date().getTime() / 1000
    const minusTime = new BigNumber(userData.lockEndTime).gt(0) ? userData.lockEndTime : currentTime
    const lockDuration = new BigNumber(incentives?.campaignClaimTime ?? 0).plus(thresholdLockTime).minus(minusTime)
    const week = Math.ceil(new BigNumber(lockDuration).div(ONE_WEEK_DEFAULT).toNumber())
    return new BigNumber(week).times(ONE_WEEK_DEFAULT).toNumber()
  }, [incentives, thresholdLockTime, userData])

  return (
    <Flex flexDirection={['column', 'column', 'column', 'row']}>
      <Flex flexDirection="column" width={['100%', '100%', '100%', '354px']}>
        {!isOnlyNeedExtendLock ? (
          <>
            <Text textAlign={['left', 'left', 'left', 'center']} color="secondary" bold mb="8px">
              {t('You have no CAKE locked.')}
            </Text>
            <Text textAlign={['left', 'left', 'left', 'center']} mb="20px">
              <Text textAlign={['left', 'left', 'left', 'center']} as="span">
                {t('Lock any amount of CAKE for')}
              </Text>
              <Text textAlign={['left', 'left', 'left', 'center']} as="span" m="0 4px" bold>
                {formatSecondsToWeeks(minLockWeekInSeconds)}
              </Text>
              <Text textAlign={['left', 'left', 'left', 'center']} as="span">
                {t('or more to claim rewards from trades!')}
              </Text>
            </Text>
          </>
        ) : (
          <>
            <Text textAlign={['left', 'left', 'left', 'center']} color="secondary" bold mb="8px">
              {t('Not enough remaining lock duration')}
            </Text>
            <Text textAlign={['left', 'left', 'left', 'center']} mb="20px">
              <Text as="span">{t('Extend your position to for')}</Text>
              <Text as="span" m="0 4px" bold>
                {formatSecondsToWeeks(minLockWeekInSeconds)}
              </Text>
              <Text as="span">{t('or more to claim rewards from trades!')}</Text>
            </Text>
          </>
        )}
        <Container>
          <Flex width="100%" margin="auto" flexDirection="column">
            <Text
              padding="24px 0 8px 0"
              textTransform="uppercase"
              color="secondary"
              bold
              textAlign={['left', 'left', 'left', 'center']}
            >
              {t('Your Position')}
            </Text>
            <Flex width={['100%', '100%', '100%', '228px']} m="auto" justifyContent="space-between">
              <Flex>
                <Flex flexDirection="column">
                  <Text fontSize="12px" color="textSubtle" textTransform="uppercase" bold>
                    {`CAKE ${t('Locked')}`}
                  </Text>
                  <Text bold fontSize="20px" lineHeight="110%" color={cakeAsNumberBalance > 0 ? 'text' : 'failure'}>
                    {cakeAsDisplayBalance}
                  </Text>
                  <Text fontSize="12px" lineHeight="110%" color={cakeAsNumberBalance > 0 ? 'text' : 'failure'}>
                    {`~$${formatNumber(cakePrice)} USD`}
                  </Text>
                </Flex>
              </Flex>
              <Flex>
                <Flex flexDirection="column">
                  <Text fontSize="12px" color="textSubtle" textTransform="uppercase" bold>
                    {t('Unlocks In')}
                  </Text>
                  <Text
                    bold
                    fontSize="20px"
                    lineHeight="110%"
                    color={isValidLockDuration && secondDuration > 0 ? 'text' : 'failure'}
                  >
                    {secondDuration === 0 ? t('0 Weeks') : remainingTime}
                  </Text>
                </Flex>
              </Flex>
            </Flex>
            <Actions
              lockEndTime={lockEndTime}
              lockStartTime={lockStartTime}
              lockedAmount={cakeAsBigNumber}
              stakingToken={stakingToken}
              currentBalance={currentBalance}
              isOnlyNeedExtendLock={isOnlyNeedExtendLock}
              customLockWeekInSeconds={minLockWeekInSeconds}
            />
          </Flex>
        </Container>
      </Flex>
    </Flex>
  )
}

export default NoCakeLockedOrExtendLock
