import React, { useState, useCallback } from 'react'
import styled from 'styled-components'
import { Button, useModal, IconButton, AddIcon, MinusIcon, Skeleton } from '@pancakeswap/uikit'
import { useLocation } from 'react-router-dom'
import UnlockButton from 'components/UnlockButton'
import { useWeb3React } from '@web3-react/core'
import { useFarmUser } from 'state/hooks'
import { FarmWithStakedValue } from 'views/Farms/components/FarmCard/FarmCard'
import { useTranslation } from 'contexts/Localization'
import { useApprove } from 'hooks/useApprove'
import { getBep20Contract } from 'utils/contractHelpers'
import { BASE_ADD_LIQUIDITY_URL } from 'config'
import getLiquidityUrlPathParts from 'utils/getLiquidityUrlPathParts'
import { getBalanceNumber, getFullDisplayBalance } from 'utils/formatBalance'
import useStake from 'hooks/useStake'
import useUnstake from 'hooks/useUnstake'
import useWeb3 from 'hooks/useWeb3'

import DepositModal from '../../DepositModal'
import WithdrawModal from '../../WithdrawModal'
import { ActionContainer, ActionTitles, ActionContent, Earned, Title, Subtle } from './styles'

const IconButtonWrapper = styled.div`
  display: flex;
`

interface StackedActionProps extends FarmWithStakedValue {
  userDataReady: boolean
}

const Staked: React.FunctionComponent<StackedActionProps> = ({
  pid,
  lpSymbol,
  lpAddresses,
  quoteToken,
  token,
  userDataReady,
}) => {
  const { t } = useTranslation()
  const { account } = useWeb3React()
  const [requestedApproval, setRequestedApproval] = useState(false)
  const { allowance, tokenBalance, stakedBalance } = useFarmUser(pid)
  const { onStake } = useStake(pid)
  const { onUnstake } = useUnstake(pid)
  const web3 = useWeb3()
  const location = useLocation()

  const isApproved = account && allowance && allowance.isGreaterThan(0)

  const lpAddress = lpAddresses[process.env.REACT_APP_CHAIN_ID]
  const liquidityUrlPathParts = getLiquidityUrlPathParts({
    quoteTokenAddress: quoteToken.address,
    tokenAddress: token.address,
  })
  const addLiquidityUrl = `${BASE_ADD_LIQUIDITY_URL}/${liquidityUrlPathParts}`

  const displayBalance = useCallback(() => {
    const stakedBalanceNumber = getBalanceNumber(stakedBalance)
    if (stakedBalanceNumber > 0 && stakedBalanceNumber < 0.0001) {
      return getFullDisplayBalance(stakedBalance).toLocaleString()
    }
    return stakedBalanceNumber.toLocaleString()
  }, [stakedBalance])

  const [onPresentDeposit] = useModal(
    <DepositModal max={tokenBalance} onConfirm={onStake} tokenName={lpSymbol} addLiquidityUrl={addLiquidityUrl} />,
  )
  const [onPresentWithdraw] = useModal(<WithdrawModal max={stakedBalance} onConfirm={onUnstake} tokenName={lpSymbol} />)

  const lpContract = getBep20Contract(lpAddress, web3)

  const { onApprove } = useApprove(lpContract)

  const handleApprove = useCallback(async () => {
    try {
      setRequestedApproval(true)
      await onApprove()
      setRequestedApproval(false)
    } catch (e) {
      console.error(e)
    }
  }, [onApprove])

  if (!account) {
    return (
      <ActionContainer>
        <ActionTitles>
          <Subtle>{t('START FARMING')}</Subtle>
        </ActionTitles>
        <ActionContent>
          <UnlockButton width="100%" />
        </ActionContent>
      </ActionContainer>
    )
  }

  if (isApproved) {
    if (stakedBalance.gt(0)) {
      return (
        <ActionContainer>
          <ActionTitles>
            <Title>{lpSymbol} </Title>
            <Subtle>{t('STAKED')}</Subtle>
          </ActionTitles>
          <ActionContent>
            <div>
              <Earned>{displayBalance()}</Earned>
            </div>
            <IconButtonWrapper>
              <IconButton variant="secondary" onClick={onPresentWithdraw} mr="6px">
                <MinusIcon color="primary" width="14px" />
              </IconButton>
              <IconButton variant="secondary" onClick={onPresentDeposit}>
                <AddIcon color="primary" width="14px" />
              </IconButton>
            </IconButtonWrapper>
          </ActionContent>
        </ActionContainer>
      )
    }

    return (
      <ActionContainer>
        <ActionTitles>
          <Subtle>{t('STAKE')} </Subtle>
          <Title>{lpSymbol}</Title>
        </ActionTitles>
        <ActionContent>
          <Button
            width="100%"
            onClick={onPresentDeposit}
            variant="secondary"
            disabled={['history', 'archived'].some((item) => location.pathname.includes(item))}
          >
            {t('Stake LP')}
          </Button>
        </ActionContent>
      </ActionContainer>
    )
  }

  if (!userDataReady) {
    return (
      <ActionContainer>
        <ActionTitles>
          <Subtle>{t('START FARMING')}</Subtle>
        </ActionTitles>
        <ActionContent>
          <Skeleton width={180} marginBottom={28} marginTop={14} />
        </ActionContent>
      </ActionContainer>
    )
  }

  return (
    <ActionContainer>
      <ActionTitles>
        <Subtle>{t('ENABLE FARM')}</Subtle>
      </ActionTitles>
      <ActionContent>
        <Button
          width="100%"
          disabled={requestedApproval || location.pathname.includes('archived')}
          onClick={handleApprove}
          variant="secondary"
        >
          {t('Enable')}
        </Button>
      </ActionContent>
    </ActionContainer>
  )
}

export default Staked
