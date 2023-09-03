import { useTranslation } from '@pancakeswap/localization'
import styled from 'styled-components'
import { Flex, Text, Box, LinkExternal, useTooltip, TooltipText } from '@pancakeswap/uikit'
import { ConfirmModalState } from '../types'

const StepsContainer = styled(Flex)`
  width: 100px;
  height: 8px;
  border-radius: 4px;
  margin: 16px auto;
  overflow: hidden;
  background: ${({ theme }) => theme.colors.input};
`

const Step = styled('div')<{ active?: boolean }>`
  height: 100%;
  width: 33.33%;
  background: ${({ theme, active }) => (active ? theme.colors.secondary : theme.colors.input)};
`

interface ApproveStepFlowProps {
  confirmModalState: ConfirmModalState
}

const ApproveStepFlow: React.FC<React.PropsWithChildren<ApproveStepFlowProps>> = ({ confirmModalState }) => {
  const { t } = useTranslation()
  const { targetRef, tooltip, tooltipVisible } = useTooltip(
    <Text>
      {t(
        'If wallet require you to enter the number of tokens you want to approve, you could enter a number that is greater than or equal to the amount of tokens you are swapping.',
      )}
    </Text>,
    { placement: 'top' },
  )

  return (
    <Box>
      <Text fontSize="12px" textAlign="center" color="textSubtle">
        {t('Proceed in your wallet')}
      </Text>
      <StepsContainer>
        <Step active={confirmModalState === ConfirmModalState.APPROVING_TOKEN} />
        <Step active={confirmModalState === ConfirmModalState.APPROVE_PENDING} />
        <Step active={confirmModalState === ConfirmModalState.PENDING_CONFIRMATION} />
      </StepsContainer>
      {(confirmModalState === ConfirmModalState.APPROVING_TOKEN ||
        confirmModalState === ConfirmModalState.APPROVE_PENDING) && (
        <LinkExternal
          external
          margin="auto"
          href="https://docs.pancakeswap.finance/products/yield-farming/bcake/faq#how-are-the-bcake-multipliers-calculated" // TODO: Change URL
        >
          <Text color="primary">{t('Why')}</Text>
          <TooltipText color="primary" m="0 2px" decorationColor="primary" ref={targetRef}>
            {t('approving')}
          </TooltipText>
          {tooltipVisible && tooltip}
          <Text color="primary">{t('this?')}</Text>
        </LinkExternal>
      )}
    </Box>
  )
}

export default ApproveStepFlow
