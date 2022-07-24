import { Contract } from '@ethersproject/contracts'
import { AutoRenewIcon, Box, Button, Modal, Text, LogoIcon } from '@pancakeswap/uikit'
import BigNumber from 'bignumber.js'
import { useTranslation } from 'contexts/Localization'
import { useBCakeProxyContract } from 'hooks/useContract'
import { useMemo, useState } from 'react'
import styled from 'styled-components'
import { getFullDisplayBalance } from 'utils/formatBalance'
import { useApproveBoostProxyFarm } from '../hooks/useApproveFarm'
import { useBCakeProxyContractAddress } from '../hooks/useBCakeProxyContractAddress'

export const StepperWrapper = styled.div<{ finished: boolean }>`
  position: relative;
  height: 20px;
  width: 20px;
  display: inline-block;
  vertical-align: top;
  &:not(:last-child) {
    margin-right: calc((100% - 60px) / 2);
    &::before {
      position: absolute;
      content: '';
      width: 90px;
      height: 2px;
      top: 9px;
      left: 30px;
      background-color: ${({ theme, finished }) => (finished ? theme.colors.textSubtle : theme.colors.disabled)};
    }
  }
`

export const StepperCircle = styled.div`
  height: 20px;
  width: 20px;
  border-radius: 50%;

  background-color: #d0d3d4;

  color: white;
  text-align: center;
  line-height: 20px; ;
`
export const StepperText = styled.div<{ active: boolean }>`
  position: absolute;
  top: calc(100% + 10px);
  left: 50%;
  transform: translateX(-50%);
  transition: 0.3s color ease-in-out;
  will-change: color;
  text-transform: uppercase;
  color: ${({ theme, active }) => (active ? theme.colors.primary : theme.colors.disabled)};
`
export const FooterBox = styled.div`
  margin-top: 24px;
  padding-top: 24px;
  position: relative;
  &::before {
    content: '';
    position: absolute;
    height: 1px;
    width: 100%;
    top: 0px;
    left: 0px;
    background-color: ${({ theme }) => theme.colors.cardBorder};
  }
`
interface BCakeMigrateModalProps {
  lpContract: Contract
  stakedBalance: BigNumber
  onUnStack: (amount: string, callback: () => void) => void
  onDismiss?: () => void
  pid: number
}

type Steps = 'unStake' | 'enable' | 'stake'

const migrationSteps: Record<Steps, string> = {
  unStake: 'Unstake LP tokens from the farm',
  enable: 'Enable staking with yield booster',
  stake: 'Stake LP tokens back to the farm',
}
const migrationStepsKeys = Object.keys(migrationSteps)

export const BCakeMigrateModal: React.FC<BCakeMigrateModalProps> = ({
  lpContract,
  stakedBalance,
  onDismiss,
  onUnStack,
  pid,
}) => {
  const [activatedState, setActivatedState] = useState<Steps>('unStake')
  const [isLoading, setIsLoading] = useState(false)
  const { t } = useTranslation()
  const { onApprove } = useApproveBoostProxyFarm(lpContract)
  const fullBalance = useMemo(() => {
    return getFullDisplayBalance(stakedBalance)
  }, [stakedBalance])
  const { proxyAddress } = useBCakeProxyContractAddress()
  const bCakeProxy = useBCakeProxyContract(proxyAddress)

  const onStepChange = async () => {
    if (activatedState === 'unStake') {
      setIsLoading(true)
      onUnStack(fullBalance, () => {
        setActivatedState('enable')
        setIsLoading(false)
      })
    } else if (activatedState === 'enable') {
      setIsLoading(true)
      try {
        await onApprove()
        setActivatedState('stake')
      } catch (error) {
        console.error(error)
      } finally {
        setIsLoading(false)
      }
    } else {
      setIsLoading(true)
      try {
        await bCakeProxy.deposit(pid, fullBalance)
        onDismiss?.()
      } catch (error) {
        console.error(error)
      } finally {
        setIsLoading(false)
      }
    }
  }
  return (
    <Modal title="Migrate your stakings" width="420px">
      <Text width="320px" p="16px">
        {t('You will need to migrate your stakings before activating yield booster for a farm')}
      </Text>
      <Box pb={20} pl={23} pr={15}>
        {migrationStepsKeys.map((step, index) => {
          return (
            <StepperWrapper finished={index < migrationStepsKeys.findIndex((d) => d === activatedState)}>
              {step === activatedState ? <LogoIcon width={22} /> : <StepperCircle>{index + 1}</StepperCircle>}
              <StepperText active={step === activatedState}>{step}</StepperText>
            </StepperWrapper>
          )
        })}
      </Box>
      <FooterBox>
        <Text mb="16px" textAlign="center">
          {migrationStepsKeys.findIndex((d) => d === activatedState) + 1}. {t(migrationSteps[activatedState])}
        </Text>
        <Button
          onClick={onStepChange}
          isLoading={isLoading}
          width="100%"
          endIcon={isLoading ? <AutoRenewIcon spin color="currentColor" /> : undefined}
        >
          {isLoading ? t('Confirming...') : t(activatedState)}
        </Button>
      </FooterBox>
    </Modal>
  )
}
