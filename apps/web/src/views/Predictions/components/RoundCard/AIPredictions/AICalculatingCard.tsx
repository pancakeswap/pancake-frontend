import { useTranslation } from '@pancakeswap/localization'
import { BetPosition } from '@pancakeswap/prediction'
import { Card, CardBody, Flex, InfoIcon, Spinner, TooltipText, WaitIcon, useTooltip } from '@pancakeswap/uikit'
import useTheme from 'hooks/useTheme'
import { NodeRound } from 'state/types'
import { RoundResultBox } from '../../RoundResult'
import CardHeader, { getBorderBackground } from '../CardHeader'
import MultiplierArrow from '../MultiplierArrow'

interface AICalculatingCardProps {
  round: NodeRound
}

export const AICalculatingCard: React.FC<React.PropsWithChildren<AICalculatingCardProps>> = ({ round }) => {
  const { t } = useTranslation()
  const { theme } = useTheme()
  const { targetRef, tooltip, tooltipVisible } = useTooltip(
    t('This round’s closing transaction has been submitted to the blockchain, and is awaiting confirmation.'),
    { placement: 'bottom' },
  )

  return (
    <>
      <Card borderBackground={getBorderBackground(theme, 'calculating')}>
        <CardHeader
          status="calculating"
          icon={<WaitIcon mr="4px" width="21px" />}
          title={t('Calculating')}
          epoch={round.epoch}
        />
        <CardBody p="16px">
          <MultiplierArrow isDisabled />
          <RoundResultBox>
            <Flex alignItems="center" justifyContent="center" flexDirection="column">
              <Spinner size={96} />
              <Flex mt="8px" ref={targetRef}>
                <TooltipText>{t('Calculating')}</TooltipText>
                <InfoIcon ml="4px" />
              </Flex>
            </Flex>
          </RoundResultBox>
          <MultiplierArrow betPosition={BetPosition.BEAR} isDisabled />
        </CardBody>
      </Card>
      {tooltipVisible && tooltip}
    </>
  )
}
