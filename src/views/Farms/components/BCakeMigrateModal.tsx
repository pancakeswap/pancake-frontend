import { Contract } from '@ethersproject/contracts'
import {
  AutoRenewIcon,
  Box,
  Button,
  CheckmarkIcon,
  HelpIcon,
  LogoIcon,
  Modal,
  Text,
  useTooltip,
} from '@pancakeswap/uikit'
import { useWeb3React } from '@web3-react/core'
import BigNumber from 'bignumber.js'
import { ToastDescriptionWithTx } from 'components/Toast'
import { DEFAULT_TOKEN_DECIMAL } from 'config'
import { useTranslation } from 'contexts/Localization'
import useCatchTxError from 'hooks/useCatchTxError'
import { useBCakeProxyContract } from 'hooks/useContract'
import useToast from 'hooks/useToast'
import { useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'
import { getFullDisplayBalance } from 'utils/formatBalance'
import { useApproveBoostProxyFarm } from '../hooks/useApproveFarm'
import { useBCakeProxyContractAddress } from '../hooks/useBCakeProxyContractAddress'

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
  onUpdateFarm: () => void
}

enum Steps {
  'UNSTAKE',
  'ENABLE',
  'STAKE',
}

const migrationSteps: Record<Steps, string> = {
  [Steps.UNSTAKE]: 'Unstake LP tokens from the farm',
  [Steps.ENABLE]: 'Enable staking with yield booster',
  [Steps.STAKE]: 'Stake LP tokens back to the farm',
}
const migrationStepsKeys = Object.keys(migrationSteps)

export const BCakeMigrateModal: React.FC<BCakeMigrateModalProps> = ({
  lpContract,
  stakedBalance,
  onDismiss,
  onUnStack,
  pid,
  onUpdateFarm,
}) => {
  const { account } = useWeb3React()
  const [activatedState, setActivatedState] = useState<Steps>(Steps.UNSTAKE)
  const [isLoading, setIsLoading] = useState(false)
  const [isApproved, setIsApproved] = useState(false)
  const { t } = useTranslation()
  const fullBalance = useMemo(() => {
    return getFullDisplayBalance(stakedBalance)
  }, [stakedBalance])
  const { proxyAddress } = useBCakeProxyContractAddress(account)
  const { onApprove } = useApproveBoostProxyFarm(lpContract, proxyAddress)
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
    if (activatedState === Steps.UNSTAKE) {
      setIsLoading(true)
      onUnStack(fullBalance, () => {
        if (isApproved) setActivatedState(Steps.STAKE)
        else setActivatedState(Steps.ENABLE)
        setIsLoading(false)
      })
    } else if (activatedState === Steps.ENABLE) {
      const receipt = await fetchWithCatchTxError(onApprove)
      if (receipt?.status) {
        toastSuccess(t('Contract Enabled'), <ToastDescriptionWithTx txHash={receipt.transactionHash} />)
        setActivatedState(Steps.STAKE)
        onUpdateFarm()
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
          onUpdateFarm()
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
              <StepperText>{Steps[step]}</StepperText>
            </StepperWrapper>
          )
        })}
      </Box>
      <FooterBox>
        <Text mb="16px" textAlign="center">
          {activatedState + 1}. {t(migrationSteps[activatedState])}
        </Text>
        <Button
          onClick={onStepChange}
          isLoading={isLoading || loading}
          width="100%"
          endIcon={isLoading || loading ? <AutoRenewIcon spin color="currentColor" /> : undefined}
        >
          {isLoading || loading ? t('Confirming...') : t(Steps[activatedState])}
        </Button>
      </FooterBox>
    </Modal>
  )
}
