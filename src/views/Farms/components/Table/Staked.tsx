import React, { useState, useCallback, useMemo } from 'react'
import styled from 'styled-components'
import { Button } from '@pancakeswap-libs/uikit'
import UnlockButton from 'components/UnlockButton'
import { useWeb3React } from '@web3-react/core'
import StakeAction from 'views/Farms/components/FarmCard/StakeAction'
import { useFarmUser } from 'state/hooks'
import { FarmWithStakedValue } from 'views/Farms/components/FarmCard/FarmCard'
import useI18n from 'hooks/useI18n'
import { useApprove } from 'hooks/useApprove'
import { getContract } from 'utils/erc20'
import { BASE_ADD_LIQUIDITY_URL } from 'config'
import getLiquidityUrlPathParts from 'utils/getLiquidityUrlPathParts'
import erc20 from 'config/abi/erc20.json'

const Container = styled.div`
  display: flex;
  width: 100%;
  justify-content: center;
  align-items: center;

  button {
    white-space: nowrap;
    color: white;
    height: 32px;
    width: 160px;
    border-radius: 16px;
    padding-left: 0;
    padding-right: 0;
  }
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
  const { account, library: ethereum } = useWeb3React()
  const [requestedApproval, setRequestedApproval] = useState(false)
  const { allowance, tokenBalance, stakedBalance } = useFarmUser(pid)
  const isApproved = account && allowance && allowance.isGreaterThan(0)
  const lpAddress = lpAddresses[process.env.REACT_APP_CHAIN_ID]
  const liquidityUrlPathParts = getLiquidityUrlPathParts({ quoteTokenAdresses, quoteTokenSymbol, tokenAddresses })
  const addLiquidityUrl = `${BASE_ADD_LIQUIDITY_URL}/${liquidityUrlPathParts}`

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
      return (
        <Container>
          <StakeAction
            stakedBalance={stakedBalance}
            tokenBalance={tokenBalance}
            tokenName={lpSymbol.toUpperCase()}
            pid={pid}
            addLiquidityUrl={addLiquidityUrl}
          />
        </Container>
      )
    }

    return (
      <Container>
        <Button fullWidth disabled={requestedApproval} onClick={handleApprove}>
          {TranslateString(999, 'Approve Contract')}
        </Button>
      </Container>
    )
  }

  return (
    <Container>
      <UnlockButton />
    </Container>
  )
}

export default Staked
