import { useTranslation } from '@pancakeswap/localization'
import styled from 'styled-components'
import { Flex, Text, Box, LinkExternal } from '@pancakeswap/uikit'
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
  hideStepIndicators: boolean
}

const ApproveStepFlow: React.FC<React.PropsWithChildren<ApproveStepFlowProps>> = ({
  confirmModalState,
  hideStepIndicators,
}) => {
  const { t } = useTranslation()

  return (
    <Box>
      <Text fontSize="12px" textAlign="center" color="textSubtle">
        {t('Proceed in your wallet')}
      </Text>
      {!hideStepIndicators && (
        <>
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
              {t('Why approving this?')}
            </LinkExternal>
          )}
        </>
      )}
    </Box>
  )
}

export default ApproveStepFlow
