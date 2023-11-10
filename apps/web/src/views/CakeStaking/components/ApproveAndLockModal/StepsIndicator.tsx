import { useTranslation } from '@pancakeswap/localization'
import { Box, Flex, Text } from '@pancakeswap/uikit'
import { ApproveAndLockStatus } from 'state/vecake/atoms'
import styled from 'styled-components'

const StepsContainer = styled(Flex)`
  width: 100px;
  height: 8px;
  border-radius: 4px;
  margin: 16px auto auto auto;
  overflow: hidden;
  background: ${({ theme }) => theme.colors.input};
`

type StepProps = {
  active: boolean
}

const Step = styled('div').withConfig({ shouldForwardProp: (prop) => prop !== 'active' })<StepProps>`
  height: 100%;
  background: ${({ theme, active }) => (active ? theme.colors.secondary : theme.colors.input)};
  flex: 1;
`

const STEPS = [
  {
    status: ApproveAndLockStatus.APPROVING_TOKEN,
  },
  {
    status: ApproveAndLockStatus.LOCK_CAKE,
  },
]

export const StepsIndicator = ({ currentStep }) => {
  const { t } = useTranslation()

  if (currentStep < STEPS[0].status || currentStep > STEPS[STEPS.length - 1].status) return null

  return (
    <Box mt="32px">
      <Text fontSize="12px" textAlign="center" color="textSubtle">
        {t('Proceed in your wallet')}
      </Text>

      <>
        <StepsContainer>
          {STEPS.map(({ status }) => {
            return <Step key={status} active={currentStep === status} />
          })}
        </StepsContainer>
      </>
    </Box>
  )
}
