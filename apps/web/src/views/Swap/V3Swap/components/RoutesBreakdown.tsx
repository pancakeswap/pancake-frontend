import { useDebounce } from '@pancakeswap/hooks'
import { useTranslation } from '@pancakeswap/localization'
import { Route } from '@pancakeswap/smart-router'
import { Box, IconButton, QuestionHelper, SearchIcon, Text, useModalV2 } from '@pancakeswap/uikit'
import { memo } from 'react'
import { styled } from 'styled-components'

import { RowBetween } from 'components/Layout/Row'
import SwapRoute from 'views/Swap/components/SwapRoute'
import { useWallchainStatus } from '../hooks/useWallchain'
import { RouteDisplayEssentials, RouteDisplayModal } from './RouteDisplayModal'

interface Props {
  routes?: RouteDisplayEssentials[]
  isMM?: boolean
}

const RouteInfoContainer = styled(RowBetween)`
  padding: 4px 24px 0;
`

export const RoutesBreakdown = memo(function RoutesBreakdown({ routes = [], isMM }: Props) {
  const [wallchainStatus] = useWallchainStatus()
  const { t } = useTranslation()
  const routeDisplayModal = useModalV2()
  const deferWallchainStatus = useDebounce(wallchainStatus, 500)

  if (!routes.length) {
    return null
  }

  const count = routes.length

  return (
    <>
      <RouteInfoContainer>
        <span style={{ display: 'flex', alignItems: 'center' }}>
          <Text fontSize="14px" color="textSubtle">
            {isMM ? t('MM Route') : deferWallchainStatus === 'found' ? t('Bonus Route') : t('Route')}
          </Text>
          <QuestionHelper
            text={
              deferWallchainStatus === 'found'
                ? t(
                    'A Bonus route provided by API is automatically selected for your trade to achieve the best price for your trade.',
                  )
                : t(
                    'Route is automatically calculated based on your routing preference to achieve the best price for your trade.',
                  )
            }
            ml="4px"
            placement="top-start"
          />
        </span>
        <Box onClick={routeDisplayModal.onOpen} role="button">
          <span style={{ display: 'flex', alignItems: 'center' }}>
            {count > 1 ? (
              <Text fontSize="14px">{t('%count% Separate Routes', { count })}</Text>
            ) : (
              <RouteComp route={routes[0]} />
            )}
            <IconButton ml="8px" variant="text" color="textSubtle" scale="xs">
              <SearchIcon width="16px" height="16px" color="textSubtle" />
            </IconButton>
          </span>
        </Box>
        <RouteDisplayModal {...routeDisplayModal} routes={routes} />
      </RouteInfoContainer>
    </>
  )
})

export const XRoutesBreakdown = memo(function XRoutesBreakdown() {
  const { t } = useTranslation()

  return (
    <>
      <RouteInfoContainer>
        <span style={{ display: 'flex', alignItems: 'center' }}>
          <Text fontSize="14px" color="textSubtle">
            {t('Route')}
          </Text>
          <QuestionHelper
            text={t(
              'Route is automatically calculated based on your routing preference to achieve the best price for your trade.',
            )}
            ml="4px"
            placement="top-start"
          />
        </span>
        <Box>
          <span style={{ display: 'flex', alignItems: 'center' }}>
            <Text fontSize="14px">PancakeSwap X</Text>
          </span>
        </Box>
      </RouteInfoContainer>
    </>
  )
})

interface RouteProps {
  route: Pick<Route, 'path'>
}

function RouteComp({ route }: RouteProps) {
  const { path } = route

  return (
    <RowBetween>
      <SwapRoute path={path} />
    </RowBetween>
  )
}
