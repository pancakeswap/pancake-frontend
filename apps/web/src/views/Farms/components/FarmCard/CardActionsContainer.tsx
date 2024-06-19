import { FarmWithStakedValue } from '@pancakeswap/farms'
import { useTranslation } from '@pancakeswap/localization'
import { AtomBox, Button, Flex, RowBetween, Skeleton, Text } from '@pancakeswap/uikit'
import ConnectWalletButton from 'components/ConnectWalletButton'

import { useRouter } from 'next/router'
import { useMemo } from 'react'
import { styled, useTheme } from 'styled-components'
import { StatusView } from 'views/Farms/components/YieldBooster/components/bCakeV3/StatusView'
import { StatusViewButtons } from 'views/Farms/components/YieldBooster/components/bCakeV3/StatusViewButtons'
import { useBCakeBoostLimitAndLockInfo } from 'views/Farms/components/YieldBooster/hooks/bCakeV3/useBCakeV3Info'
import { useBoostStatusPM } from 'views/Farms/components/YieldBooster/hooks/bCakeV3/useBoostStatus'
import { useWrapperBooster } from 'views/PositionManagers/hooks'
import { useUpdateBCakeFarms } from '../../hooks/useUpdateBCake'
import { HarvestActionContainer } from '../FarmTable/Actions/HarvestAction'
import { StakedContainer } from '../FarmTable/Actions/StakedAction'
import HarvestAction from './HarvestAction'
import StakeAction from './StakeAction'

export const ActionContainer = styled(Flex)`
  width: 100%;
  border: 1px solid ${({ theme }) => theme.colors.input};
  border-radius: 16px;
  flex-grow: 1;
  flex-basis: 0;
  margin-bottom: 8px;
  flex-wrap: wrap;
  padding: 16px;
  gap: 24px;
`

export const Title = styled.div`
  color: ${({ theme }) => theme.colors.textSubtle};
  font-feature-settings: 'liga' off;
  font-family: Kanit;
  font-size: 12px;
  font-style: normal;
  font-weight: 600;
  line-height: 120%; /* 14.4px */
  letter-spacing: 0.36px;
  text-transform: uppercase;
`

interface FarmCardActionsProps {
  farm: FarmWithStakedValue
  account?: string
  addLiquidityUrl?: string
  lpLabel?: string
  displayApr?: string | null
  boosterMultiplier?: number
}

const CardActions: React.FC<React.PropsWithChildren<FarmCardActionsProps>> = ({
  farm,
  account,
  addLiquidityUrl,
  lpLabel,
  displayApr,
  boosterMultiplier = 1,
}) => {
  const { t } = useTranslation()
  const { pid, token, quoteToken, vaultPid, lpSymbol, bCakeWrapperAddress, bCakeUserData } = farm

  const isReady = farm.multiplier !== undefined
  const isBooster = Boolean(bCakeWrapperAddress) && farm?.bCakePublicData?.isRewardInRange
  const { earnings } = (isBooster ? farm.bCakeUserData : farm.userData) || {}
  const { status } = useBoostStatusPM(isBooster, boosterMultiplier)
  const { colors } = useTheme()
  const dividerBorderStyle = useMemo(() => `1px solid ${colors.input}`, [colors.input])
  const { shouldUpdate, veCakeUserMultiplierBeforeBoosted } = useWrapperBooster(
    farm.bCakeUserData?.boosterContractAddress ?? '0x',
    boosterMultiplier ?? 1,
    bCakeWrapperAddress,
  )
  const { onUpdate } = useUpdateBCakeFarms(bCakeWrapperAddress ?? '0x', pid)
  const { locked } = useBCakeBoostLimitAndLockInfo()
  const router = useRouter()
  const isHistory = useMemo(() => router.pathname.includes('history'), [router])

  return (
    <AtomBox mt="16px">
      <ActionContainer bg="background" flexDirection="column">
        {!isReady && <Skeleton width={80} height={18} mb="4px" />}
        {!account ? (
          <RowBetween flexDirection="column" alignItems="flex-start" flex={1} width="100%">
            <Title>{t('Start Earning')}</Title>
            <ConnectWalletButton mt="8px" width="100%" />
          </RowBetween>
        ) : (
          <>
            <RowBetween flexDirection="column" alignItems="flex-start" flex={1} width="100%">
              <Flex>
                <Text bold textTransform="uppercase" color="secondary" fontSize="12px" pr="4px">
                  {lpSymbol}
                </Text>
                <Text bold textTransform="uppercase" color="textSubtle" fontSize="12px">
                  {t('Staked')}
                </Text>
              </Flex>
              <StakedContainer {...farm} lpLabel={lpLabel} addLiquidityUrl={addLiquidityUrl} displayApr={displayApr}>
                {(props) => <StakeAction {...props} />}
              </StakedContainer>
            </RowBetween>
            <AtomBox
              width={{
                xs: '100%',
                md: 'auto',
              }}
              style={{ borderLeft: dividerBorderStyle, borderTop: dividerBorderStyle }}
            />
            <RowBetween flexDirection="column" alignItems="flex-start" flex={1} width="100%">
              <Flex>
                <Text bold textTransform="uppercase" color="secondary" fontSize="12px" pr="4px">
                  CAKE
                </Text>
                <Text bold textTransform="uppercase" color="textSubtle" fontSize="12px">
                  {t('Earned')}
                </Text>
              </Flex>
              <HarvestActionContainer
                earnings={earnings}
                pid={pid}
                vaultPid={vaultPid}
                token={token}
                quoteToken={quoteToken}
                lpSymbol={lpSymbol}
                bCakeWrapperAddress={bCakeWrapperAddress}
                bCakeUserData={bCakeUserData}
              >
                {(props) => <HarvestAction {...props} />}
              </HarvestActionContainer>
            </RowBetween>
          </>
        )}
        {isBooster && !isHistory && (
          <>
            <AtomBox
              width={{
                xs: '100%',
                md: 'auto',
              }}
              style={{ borderLeft: dividerBorderStyle, borderTop: dividerBorderStyle }}
            />
            <RowBetween flexDirection="column" alignItems="flex-start" flex={1} width="100%">
              <Flex width="100%" justifyContent="space-between" alignItems="center">
                <StatusView
                  status={status}
                  isFarmStaking={farm?.bCakeUserData?.stakedBalance?.gt(0)}
                  boostedMultiplier={boosterMultiplier}
                  maxBoostMultiplier={2.5}
                  shouldUpdate={shouldUpdate && farm?.bCakeUserData?.stakedBalance?.gt(0)}
                  expectMultiplier={veCakeUserMultiplierBeforeBoosted}
                />
                <StatusViewButtons
                  locked={locked}
                  updateButton={
                    shouldUpdate && farm?.bCakeUserData?.stakedBalance?.gt(0) ? (
                      <Button onClick={onUpdate}>{t('Update')}</Button>
                    ) : null
                  }
                />
              </Flex>
            </RowBetween>
          </>
        )}
      </ActionContainer>
    </AtomBox>
  )
}

export default CardActions
