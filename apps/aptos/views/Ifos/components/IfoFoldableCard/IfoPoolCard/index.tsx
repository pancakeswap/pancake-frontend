import { useTranslation, ContextApi } from '@pancakeswap/localization'
import {
  Box,
  Card,
  CardBody,
  CardHeader,
  Flex,
  HelpIcon,
  Text,
  useTooltip,
  ExpandableLabel,
  CardFooter,
} from '@pancakeswap/uikit'
import { Ifo, PoolIds } from 'config/constants/types'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { useMemo, useState } from 'react'
import { styled } from 'styled-components'
import { getStatus } from 'views/Ifos/hooks/helpers'
import { PublicIfoData, WalletIfoData } from 'views/Ifos/types'
import useLedgerTimestamp from 'hooks/useLedgerTimestamp'
import { CardConfigReturn } from '../types'
import IfoCardActions from './IfoCardActions'
import IfoCardDetails from './IfoCardDetails'
import IfoCardTokens from './IfoCardTokens'
import IfoVestingCard from './IfoVestingCard'

const StyledCard = styled(Card)`
  width: 100%;
  margin: 0 auto;
  padding: 0 0 3px 0;
  height: fit-content;
`
const StyledCardFooter = styled(CardFooter)`
  padding: 16px;
  margin: 0 -12px -12px;
  background: ${({ theme }) => theme.colors.background};
  text-align: center;
`

interface IfoCardProps {
  poolId: PoolIds
  ifo: Ifo
  publicIfoData: PublicIfoData
  walletIfoData: WalletIfoData
}

export const cardConfig = (t: ContextApi['t'], poolId: PoolIds): CardConfigReturn => {
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

const SmallCard: React.FC<React.PropsWithChildren<IfoCardProps>> = ({ poolId, ifo, publicIfoData, walletIfoData }) => {
  const { t } = useTranslation()
  const getNow = useLedgerTimestamp()
  const { account } = useActiveWeb3React()

  const { startTime, endTime } = publicIfoData

  const { vestingInformation } = publicIfoData[poolId]

  const config = cardConfig(t, poolId)

  const { targetRef, tooltip, tooltipVisible } = useTooltip(config.tooltip, { placement: 'bottom' })

  const currentTime = getNow() / 1000

  const status = getStatus(currentTime, startTime, endTime)

  const isLoading = status === 'idle'

  const isVesting = useMemo(() => {
    return (
      account &&
      ifo.version >= 3.2 &&
      vestingInformation.percentage > 0 &&
      status === 'finished' &&
      walletIfoData[poolId].amountTokenCommittedInLP.gt(0)
    )
  }, [account, ifo, poolId, status, vestingInformation, walletIfoData])

  const cardTitle = ifo.cIFO ? `${config.title} (cIFO)` : config.title

  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <>
      {tooltipVisible && tooltip}
      <StyledCard>
        <CardHeader p="16px 24px" variant={config.variant}>
          <Flex justifyContent="space-between" alignItems="center">
            <Text bold fontSize="20px" lineHeight={1}>
              {cardTitle}
            </Text>
            <div ref={targetRef}>
              <HelpIcon />
            </div>
          </Flex>
        </CardHeader>
        <CardBody p="12px">
          {isVesting ? (
            <>
              <IfoVestingCard ifo={ifo} poolId={poolId} publicIfoData={publicIfoData} walletIfoData={walletIfoData} />
              <StyledCardFooter>
                <ExpandableLabel expanded={isExpanded} onClick={() => setIsExpanded((prev) => !prev)}>
                  {isExpanded ? t('Hide') : t('Details')}
                </ExpandableLabel>
                {isExpanded && (
                  <IfoCardDetails
                    isEligible
                    poolId={poolId}
                    ifo={ifo}
                    publicIfoData={publicIfoData}
                    walletIfoData={walletIfoData}
                  />
                )}
              </StyledCardFooter>
            </>
          ) : (
            <>
              <IfoCardTokens
                poolId={poolId}
                ifo={ifo}
                publicIfoData={publicIfoData}
                walletIfoData={walletIfoData}
                isLoading={isLoading}
              />
              <Box mt="24px">
                <IfoCardActions
                  poolId={poolId}
                  ifo={ifo}
                  publicIfoData={publicIfoData}
                  walletIfoData={walletIfoData}
                  isLoading={isLoading}
                />
              </Box>
              <IfoCardDetails
                isEligible
                poolId={poolId}
                ifo={ifo}
                publicIfoData={publicIfoData}
                walletIfoData={walletIfoData}
              />
            </>
          )}
        </CardBody>
      </StyledCard>
    </>
  )
}

export default SmallCard
