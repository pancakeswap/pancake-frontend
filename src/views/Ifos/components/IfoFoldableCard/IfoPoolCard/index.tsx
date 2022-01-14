import React from 'react'
import styled from 'styled-components'
import { useTranslation } from 'contexts/Localization'
import { ContextApi } from 'contexts/Localization/types'
import { Box, Card, CardBody, CardHeader, Flex, HelpIcon, Text, useTooltip } from '@pancakeswap/uikit'
import { Ifo, PoolIds } from 'config/constants/types'
import { useProfile } from 'state/profile/hooks'
import { PublicIfoData, WalletIfoData } from 'views/Ifos/types'
import { EnableStatus } from '../types'
import IfoCardTokens from './IfoCardTokens'
import IfoCardActions from './IfoCardActions'
import IfoCardDetails from './IfoCardDetails'

const StyledCard = styled(Card)`
  background: none;
  max-width: 368px;
  width: 100%;
  margin: 0 auto;
  height: fit-content;
`

interface IfoCardProps {
  poolId: PoolIds
  ifo: Ifo
  publicIfoData: PublicIfoData
  walletIfoData: WalletIfoData
  onApprove: () => Promise<any>
  enableStatus: EnableStatus
}

const cardConfig = (
  t: ContextApi['t'],
  poolId: PoolIds,
): {
  title: string
  variant: 'blue' | 'violet'
  tooltip: string
} => {
  switch (poolId) {
    case PoolIds.poolBasic:
      return {
        title: t('Basic Sale'),
        variant: 'blue',
        tooltip: t(
          'Every person can only commit a limited amount, but may expect a higher return per token committed.',
        ),
      }
    case PoolIds.poolUnlimited:
      return {
        title: t('Unlimited Sale'),
        variant: 'violet',
        tooltip: t('No limits on the amount you can commit. Additional fee applies when claiming.'),
      }
    default:
      return { title: '', variant: 'blue', tooltip: '' }
  }
}

const SmallCard: React.FC<IfoCardProps> = ({ poolId, ifo, publicIfoData, walletIfoData, onApprove, enableStatus }) => {
  const { t } = useTranslation()
  const config = cardConfig(t, poolId)
  const { hasProfile, isLoading: isProfileLoading } = useProfile()
  const { targetRef, tooltip, tooltipVisible } = useTooltip(config.tooltip, { placement: 'bottom' })

  const isLoading = isProfileLoading || publicIfoData.status === 'idle'

  return (
    <>
      {tooltipVisible && tooltip}
      <StyledCard>
        <CardHeader p="16px 24px" variant={config.variant}>
          <Flex justifyContent="space-between" alignItems="center">
            <Text bold fontSize="20px" lineHeight={1}>
              {config.title}
            </Text>
            <div ref={targetRef}>
              <HelpIcon />
            </div>
          </Flex>
        </CardHeader>
        <CardBody p="12px">
          <IfoCardTokens
            poolId={poolId}
            ifo={ifo}
            publicIfoData={publicIfoData}
            walletIfoData={walletIfoData}
            hasProfile={hasProfile}
            isLoading={isLoading}
            onApprove={onApprove}
            enableStatus={enableStatus}
          />
          <Box mt="24px">
            <IfoCardActions
              poolId={poolId}
              ifo={ifo}
              publicIfoData={publicIfoData}
              walletIfoData={walletIfoData}
              hasProfile={hasProfile}
              isLoading={isLoading}
            />
          </Box>
          <IfoCardDetails poolId={poolId} ifo={ifo} publicIfoData={publicIfoData} walletIfoData={walletIfoData} />
        </CardBody>
      </StyledCard>
    </>
  )
}

export default SmallCard
