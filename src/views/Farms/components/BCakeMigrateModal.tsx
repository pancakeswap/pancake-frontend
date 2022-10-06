import { Contract } from '@ethersproject/contracts'
import { useTranslation } from '@pancakeswap/localization'
import {
  AutoRenewIcon,
  Box,
  Button,
  CheckmarkIcon,
  HelpIcon,
  LogoIcon,
  Modal,
  Text,
  useToast,
  useTooltip,
} from '@pancakeswap/uikit'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import BigNumber from 'bignumber.js'
import { ToastDescriptionWithTx } from 'components/Toast'
import useCatchTxError from 'hooks/useCatchTxError'
import { useBCakeProxyContract } from 'hooks/useContract'
import { useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'
import { getFullDisplayBalance } from 'utils/formatBalance'
import { useBCakeProxyContractAddress } from '../hooks/useBCakeProxyContractAddress'
import useProxyStakedActions from './YieldBooster/hooks/useProxyStakedActions'

export const StepperCircle = styled.div`
  height: 20px;
  width: 20px;
  border-radius: 50%;
  color: white;
  text-align: center;
  line-height: 20px;
  padding: 2px;
  box-sizing: border-box;
  font-size: 12px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: bold;
`
export const StepperText = styled.div`
  position: absolute;
  top: calc(100% + 10px);
  left: 50%;
  transform: translateX(-50%);
  transition: 0.3s color ease-in-out;
  will-change: color;
  font-size: 12px;
  font-weight: 600;
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
      width: calc(((100vw / 2) - 108px));
      height: 2px;
      top: 9px;
      left: 30px;
      transition: 0.3s background-color ease-in-out;
      will-change: background-color;
      background-color: ${({ theme, finished }) => (finished ? theme.colors.textSubtle : theme.colors.disabled)};
    }
    ${({ theme }) => theme.mediaQueries.md} {
      &::before {
        width: 104px;
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
  margin-bottom: 24px;
  display: flex;
  justify-content: center;
  align-items: center;
  ${({ theme }) => theme.mediaQueries.md} {
    width: 372px;
  }
`
export const InfoText = styled.div``
export const InfoIconBox = styled.div`
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`
interface BCakeMigrateModalProps {
  lpContract: Contract
  stakedBalance: BigNumber
  onUnStack: (amount: string, callback: () => void) => void
  onDismiss?: () => void
  pid: number
}

enum Steps {
  'Unstake',
  'Enable',
  'Stake',
}

export const BCakeMigrateModal: React.FC<BCakeMigrateModalProps> = ({
  lpContract,
  stakedBalance,
  onDismiss,
  onUnStack,
  pid,
}) => {
  const { account, chainId } = useActiveWeb3React()
  const [activatedState, setActivatedState] = useState<Steps>(Steps.Unstake)
  const [isLoading, setIsLoading] = useState(false)
  const [isApproved, setIsApproved] = useState(false)
  const { t } = useTranslation()
  const steps: Record<Steps, string> = useMemo(
    () => ({
      [Steps.Unstake]: t('Unstake'),
      [Steps.Enable]: t('Enable'),
      [Steps.Stake]: t('Stake'),
    }),
    [t],
  )
  const migrationSteps: Record<Steps, string> = useMemo(
    () => ({
      [Steps.Unstake]: t('Unstake LP tokens from the farm'),
      [Steps.Enable]: t('Enable staking with yield booster'),
      [Steps.Stake]: t('Stake LP tokens back to the farm'),
    }),
    [t],
  )
  const migrationStepsKeys = useMemo(() => Object.keys(migrationSteps), [migrationSteps])
  const fullBalance = useMemo(() => {
    return getFullDisplayBalance(stakedBalance)
  }, [stakedBalance])
  const { proxyAddress } = useBCakeProxyContractAddress(account, chainId)
  const { onApprove, onDone, onStake } = useProxyStakedActions(pid, lpContract)

  const bCakeProxy = useBCakeProxyContract(proxyAddress)
  const { fetchWithCatchTxError, loading } = useCatchTxError()
  const { toastSuccess } = useToast()

  const { targetRef, tooltip, tooltipVisible } = useTooltip(
    <Text>
      {t(
        'To enable farm yield boosters, you must follow the guide and migrate your current farming positions. However, for each farm, you will only need to migrate once.',
      )}
    </Text>,
    {
      placement: 'right',
    },
  )

  useEffect(() => {
    if (!bCakeProxy) return
    bCakeProxy.lpApproved(lpContract.address).then((enabled) => {
      setIsApproved(enabled)
    })
  }, [lpContract, bCakeProxy])

  const onStepChange = async () => {
    if (activatedState === Steps.Unstake) {
      setIsLoading(true)
      onUnStack(fullBalance, () => {
        if (isApproved) setActivatedState(Steps.Stake)
        else setActivatedState(Steps.Enable)
        setIsLoading(false)
      })
    } else if (activatedState === Steps.Enable) {
      const receipt = await fetchWithCatchTxError(onApprove)
      if (receipt?.status) {
        toastSuccess(t('Contract Enabled'), <ToastDescriptionWithTx txHash={receipt.transactionHash} />)
        setActivatedState(Steps.Stake)
        onDone()
      }
    } else {
      setIsLoading(true)
      try {
        const receipt = await fetchWithCatchTxError(() => onStake(fullBalance))
        if (receipt?.status) {
          toastSuccess(
            `${t('Staked')}!`,
            <ToastDescriptionWithTx txHash={receipt.transactionHash}>
              {t('Your funds have been staked in the farm')}
            </ToastDescriptionWithTx>,
          )
          onDone()
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
    <Modal title={t('Migrate your stakings')} width="420px" onDismiss={onDismiss}>
      {tooltipVisible && tooltip}
      <InfoBox ref={targetRef}>
        <InfoText>{t('You will need to migrate your stakings before activating yield booster for a farm')}</InfoText>
        <InfoIconBox>
          <HelpIcon />
        </InfoIconBox>
      </InfoBox>
      <Box pb={20} pl={38} pr={30}>
        {migrationStepsKeys.map((step, index) => {
          return (
            <StepperWrapper
              key={step}
              active={step === activatedState.toString()}
              finished={parseInt(step) < parseInt(activatedState.toString())}
            >
              {step === activatedState.toString() ? (
                <LogoIcon width={22} />
              ) : (
                <StepperCircle>
                  {parseInt(step) < parseInt(activatedState.toString()) ? (
                    <CheckmarkIcon color="white" width={16} />
                  ) : (
                    index + 1
                  )}
                </StepperCircle>
              )}
              <StepperText>{steps[step]}</StepperText>
            </StepperWrapper>
          )
        })}
      </Box>
      <FooterBox>
        <Text mb="16px" textAlign="center">
          {activatedState + 1}. {t(migrationSteps[activatedState])}
          {/* t('Unstake LP tokens from the farm') */}
          {/* t('Enable staking with yield booster') */}
          {/* t('Stake LP tokens back to the farm') */}
        </Text>
        <Button
          onClick={onStepChange}
          isLoading={isLoading || loading}
          width="100%"
          endIcon={isLoading || loading ? <AutoRenewIcon spin color="currentColor" /> : undefined}
        >
          {isLoading || loading ? t('Confirming...') : t(steps[activatedState])}
        </Button>
      </FooterBox>
    </Modal>
  )
}
