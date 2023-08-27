import { useTranslation } from '@pancakeswap/localization'
import styled from 'styled-components'
import { Flex, Text, Box, LinkExternal } from '@pancakeswap/uikit'
import { ApprovalState } from 'hooks/useApproveCallback'

const StepsContainer = styled(Flex)`
  width: 100px;
  height: 8px;
  border-radius: 4px;
  margin: 16px auto;
  overflow: hidden;
  background: ${({ theme }) => theme.colors.inputSecondary};
`

const Step = styled('div')<{ active?: boolean }>`
  height: 100%;
  width: 33.33%;
  background: ${({ theme, active }) => (active ? theme.colors.textSubtle : theme.colors.inputSecondary)};
`

interface ApproveStepFlowProps {
  approval: ApprovalState
}

const ApproveStepFlow: React.FC<React.PropsWithChildren<ApproveStepFlowProps>> = ({ approval }) => {
  const { t } = useTranslation()

  return (
    <Box>
      <Text fontSize="12px" textAlign="center" color="textSubtle">
        {t('Proceed in your wallet')}
      </Text>
      <StepsContainer>
        <Step active={approval === ApprovalState.NOT_APPROVED} />
        <Step active={approval === ApprovalState.PENDING} />
        <Step active={approval === ApprovalState.APPROVED} />
      </StepsContainer>
      <LinkExternal
        external
        margin="auto"
        href="https://docs.pancakeswap.finance/products/yield-farming/bcake/faq#how-are-the-bcake-multipliers-calculated" // TODO: Change URL
      >
        {t('Why approving this?')}
      </LinkExternal>
    </Box>
  )
}

export default ApproveStepFlow
