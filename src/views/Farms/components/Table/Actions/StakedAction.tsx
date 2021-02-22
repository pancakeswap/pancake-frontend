import React, { useState, useCallback, useMemo } from 'react'
import styled from 'styled-components'
import { Button, useModal, IconButton, AddIcon, MinusIcon } from '@pancakeswap-libs/uikit'
import UnlockButton from 'components/UnlockButton'
import { useWallet } from '@binance-chain/bsc-use-wallet'
import { useFarmUser } from 'state/hooks'
import { FarmWithStakedValue } from 'views/Farms/components/FarmCard/FarmCard'
import useI18n from 'hooks/useI18n'
import { useApprove } from 'hooks/useApprove'
import { getContract } from 'utils/erc20'
import { BASE_ADD_LIQUIDITY_URL } from 'config'
import getLiquidityUrlPathParts from 'utils/getLiquidityUrlPathParts'
import { getBalanceNumber } from 'utils/formatBalance'
import useStake from 'hooks/useStake'
import useUnstake from 'hooks/useUnstake'
import erc20 from 'config/abi/erc20.json'

import DepositModal from '../../DepositModal'
import WithdrawModal from '../../WithdrawModal'
import { ActionContainer, ActionTitles, ActionContent, Earned, Title, Subtle } from './styles'

const IconButtonWrapper = styled.div`
  display: flex;
`

const Staked: React.FunctionComponent<FarmWithStakedValue> = ({
  pid,
  lpSymbol,
  lpAddresses,
  quoteTokenAdresses,
  quoteTokenSymbol,
  tokenAddresses,
}) => {
  const TranslateString = useI18n()
  const { account, library: ethereum } = useWallet()
  const [requestedApproval, setRequestedApproval] = useState(false)
  const { allowance, tokenBalance, stakedBalance } = useFarmUser(pid)
  const { onStake } = useStake(pid)
  const { onUnstake } = useUnstake(pid)

  const isApproved = account && allowance && allowance.isGreaterThan(0)

  const lpAddress = lpAddresses[process.env.REACT_APP_CHAIN_ID]
  const liquidityUrlPathParts = getLiquidityUrlPathParts({ quoteTokenAdresses, quoteTokenSymbol, tokenAddresses })
  const addLiquidityUrl = `${BASE_ADD_LIQUIDITY_URL}/${liquidityUrlPathParts}`
  const rawStakedBalance = getBalanceNumber(stakedBalance)
  const displayBalance = rawStakedBalance.toLocaleString()

  const [onPresentDeposit] = useModal(
    <DepositModal max={tokenBalance} onConfirm={onStake} tokenName={lpSymbol} addLiquidityUrl={addLiquidityUrl} />,
  )
  const [onPresentWithdraw] = useModal(<WithdrawModal max={stakedBalance} onConfirm={onUnstake} tokenName={lpSymbol} />)

  const lpContract = useMemo(() => {
    return getContract(lpAddress, erc20, ethereum, account)
  }, [ethereum, lpAddress, account])

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

  if (account) {
    if (isApproved) {
      if (rawStakedBalance) {
        return (
          <ActionContainer>
            <ActionTitles>
              <Title>{lpSymbol} </Title>
              <Subtle>{TranslateString(999, 'STAKED')}</Subtle>
            </ActionTitles>
            <ActionContent>
              <div>
                <Earned>{displayBalance}</Earned>
              </div>
              <IconButtonWrapper>
                <IconButton variant="secondary" onClick={onPresentWithdraw} mr="6px">
                  <MinusIcon color="primary" />
                </IconButton>
                <IconButton variant="secondary" onClick={onPresentDeposit}>
                  <AddIcon color="primary" />
                </IconButton>
              </IconButtonWrapper>
            </ActionContent>
          </ActionContainer>
        )
      }

      return (
        <ActionContainer>
          <ActionTitles>
            <Subtle>{TranslateString(999, 'STAKE')}</Subtle>
            <Title>{lpSymbol}</Title>
          </ActionTitles>
          <ActionContent>
            <Button fullWidth onClick={onPresentDeposit} variant="secondary">
              {TranslateString(999, 'Stake LP')}
            </Button>
          </ActionContent>
        </ActionContainer>
      )
    }

    return (
      <ActionContainer>
        <ActionTitles>
          <Subtle>{TranslateString(999, 'ENABLE FARM')}</Subtle>
        </ActionTitles>
        <ActionContent>
          <Button fullWidth disabled={requestedApproval} onClick={handleApprove} variant="secondary">
            {TranslateString(999, 'Enable')}
          </Button>
        </ActionContent>
      </ActionContainer>
    )
  }

  return (
    <ActionContainer>
      <ActionTitles>
        <Subtle>{TranslateString(999, 'START FARMING')}</Subtle>
      </ActionTitles>
      <ActionContent>
        <UnlockButton fullWidth />
      </ActionContent>
    </ActionContainer>
  )
}

export default Staked
