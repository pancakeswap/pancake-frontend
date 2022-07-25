import { Contract } from '@ethersproject/contracts'
import { AutoRenewIcon, Box, Button, CheckmarkIcon, LogoIcon, Modal, Text } from '@pancakeswap/uikit'
import BigNumber from 'bignumber.js'
import { DEFAULT_TOKEN_DECIMAL } from 'config'
import { useTranslation } from 'contexts/Localization'
import { useBCakeProxyContract } from 'hooks/useContract'
import useCatchTxError from 'hooks/useCatchTxError'
import { useMemo, useState, useEffect } from 'react'
import styled from 'styled-components'
import { ToastDescriptionWithTx } from 'components/Toast'
import useToast from 'hooks/useToast'
import { getFullDisplayBalance } from 'utils/formatBalance'
import { useApproveBoostProxyFarm } from '../hooks/useApproveFarm'
import { useBCakeProxyContractAddress } from '../hooks/useBCakeProxyContractAddress'

export const StepperCircle = styled.div`
  height: 20px;
  width: 20px;
  border-radius: 50%;
  color: white;
  text-align: center;
  line-height: 20px; ;
`
export const StepperText = styled.div`
  position: absolute;
  top: calc(100% + 10px);
  left: 50%;
  transform: translateX(-50%);
  transition: 0.3s color ease-in-out;
  will-change: color;
  text-transform: uppercase;
`

export const StepperWrapper = styled.div<{ finished: boolean; active: boolean }>`
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
      width: calc(((100vw / 2) - 94px));
      height: 2px;
      top: 9px;
      left: 30px;
      transition: 0.3s background-color ease-in-out;
      will-change: background-color;
      background-color: ${({ theme, finished }) => (finished ? theme.colors.textSubtle : theme.colors.disabled)};
    }
    ${({ theme }) => theme.mediaQueries.md} {
      &::before {
        width: 90px;
      }
    }
  }
  ${StepperCircle} {
    background: ${({ theme, finished }) => (finished ? theme.colors.textSubtle : theme.colors.disabled)};
  }
  ${StepperText} {
    color: ${({ theme, active, finished }) =>
      active ? theme.colors.primary : finished ? theme.colors.textSubtle : theme.colors.disabled};
  }
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

export const InfoBox = styled.div`
  padding: 16px;
  background: ${({ theme }) => theme.colors.background};
  border: 1px solid ${({ theme }) => theme.colors.cardBorder};
  border-radius: 16px;
  font-size: 12px;
  color: ${({ theme }) => theme.colors.textSubtle};
  line-height: 120%;
  width: 370px;
  margin-bottom: 24px;
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
  const [isApproved, setIsApproved] = useState(false)
  const { t } = useTranslation()
  const fullBalance = useMemo(() => {
    return getFullDisplayBalance(stakedBalance)
  }, [stakedBalance])
  const { proxyAddress } = useBCakeProxyContractAddress()
  const { onApprove } = useApproveBoostProxyFarm(lpContract, proxyAddress)
  const bCakeProxy = useBCakeProxyContract(proxyAddress)
  const { fetchWithCatchTxError, loading } = useCatchTxError()
  const { toastSuccess } = useToast()

  useEffect(() => {
    if (!bCakeProxy) return
    bCakeProxy.lpApproved(lpContract.address).then((enabled) => {
      setIsApproved(enabled)
    })
  }, [lpContract, bCakeProxy])

  const onStepChange = async () => {
    if (activatedState === 'unStake') {
      setIsLoading(true)
      onUnStack(fullBalance, () => {
        if (isApproved) setActivatedState('stake')
        else setActivatedState('enable')
        setIsLoading(false)
      })
    } else if (activatedState === 'enable') {
      const receipt = await fetchWithCatchTxError(onApprove)
      if (receipt?.status) {
        toastSuccess(t('Contract Enabled'), <ToastDescriptionWithTx txHash={receipt.transactionHash} />)
        setActivatedState('stake')
      }
    } else {
      setIsLoading(true)
      try {
        const value = new BigNumber(fullBalance).times(DEFAULT_TOKEN_DECIMAL).toString()
        const receipt = await fetchWithCatchTxError(() => bCakeProxy?.deposit(pid, value))
        if (receipt?.status) {
          toastSuccess(
            `${t('Staked')}!`,
            <ToastDescriptionWithTx txHash={receipt.transactionHash}>
              {t('Your funds have been staked in the farm')}
            </ToastDescriptionWithTx>,
          )
          onDismiss?.()
        }
      } catch (error) {
        console.error(error)
      } finally {
        setIsLoading(false)
      }
    }
  }
  return (
    <Modal title="Migrate your stakings" width="420px" onDismiss={onDismiss}>
      <InfoBox>{t('You will need to migrate your stakings before activating yield booster for a farm')}</InfoBox>
      <Box pb={20} pl={23} pr={15}>
        {migrationStepsKeys.map((step, index) => {
          return (
            <StepperWrapper
              active={step === activatedState}
              finished={index < migrationStepsKeys.findIndex((d) => d === activatedState)}
            >
              {step === activatedState ? (
                <LogoIcon width={22} />
              ) : (
                <StepperCircle>
                  {index < migrationStepsKeys.findIndex((d) => d === activatedState) ? (
                    <CheckmarkIcon color="white" />
                  ) : (
                    index + 1
                  )}
                </StepperCircle>
              )}
              <StepperText>{step}</StepperText>
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
          isLoading={isLoading || loading}
          width="100%"
          endIcon={isLoading || loading ? <AutoRenewIcon spin color="currentColor" /> : undefined}
        >
          {isLoading || loading ? t('Confirming...') : t(activatedState)}
        </Button>
      </FooterBox>
    </Modal>
  )
}
