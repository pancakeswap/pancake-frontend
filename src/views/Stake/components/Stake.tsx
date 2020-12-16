import BigNumber from 'bignumber.js'
import React, { useCallback, useState } from 'react'
import styled from 'styled-components'
import { useWallet } from 'use-wallet'
import { Contract } from 'web3-eth-contract'
import { Button, IconButton, useModal, AddIcon } from '@pancakeswap-libs/uikit'
import Card from '../../../components/Card'
import CardContent from '../../../components/CardContent'
import CardIcon from '../../../components/CardIcon'
import Label from '../../../components/Label'
import Value from '../../../components/Value'
import { useApprove } from '../../../hooks/useApprove'
import useStake from '../../../hooks/useStake'
import useTokenBalance from '../../../hooks/useTokenBalance'
import useUnstake from '../../../hooks/useUnstake'
import useI18n from '../../../hooks/useI18n'
import { getBalanceNumber } from '../../../utils/formatBalance'
import DepositModal from './DepositModal'
import WithdrawModal from './WithdrawModal'
import useSushi from '../../../hooks/useSushi'
import UnlockButton from '../../../components/UnlockButton'
import { getSyrupAddress } from '../../../sushi/utils'

interface StakeProps {
  lpContract: Contract
  pid: number
  tokenName: string
  allowance: BigNumber
  tokenBalance: BigNumber
  stakedBalance: BigNumber
}

const Stake: React.FC<StakeProps> = ({ lpContract, pid, tokenName, allowance, tokenBalance, stakedBalance }) => {
  const TranslateString = useI18n()
  const [requestedApproval, setRequestedApproval] = useState(false)
  const { account } = useWallet()
  const sushi = useSushi()

  const { onStake } = useStake(pid)
  const { onUnstake } = useUnstake(pid)
  const { onApprove } = useApprove(lpContract, pid)

  const syrupBalance = useTokenBalance(getSyrupAddress(sushi))

  const [onPresentDeposit] = useModal(<DepositModal max={tokenBalance} onConfirm={onStake} tokenName={tokenName} />)

  const [onPresentWithdraw] = useModal(
    <WithdrawModal
      max={stakedBalance.gt(syrupBalance) ? syrupBalance : stakedBalance}
      onConfirm={onUnstake}
      tokenName={tokenName}
    />,
  )

  const handleApprove = useCallback(async () => {
    try {
      setRequestedApproval(true)
      const txHash = await onApprove()
      // user rejected tx or didn't go thru
      if (!txHash) {
        setRequestedApproval(false)
      }
    } catch (e) {
      console.error(e)
    }
  }, [onApprove, setRequestedApproval])
  const isAllowed = account && allowance && allowance.isGreaterThan(0)

  return (
    <Card>
      <CardContent>
        <StyledCardContentInner>
          <StyledCardHeader>
            <CardIcon>⛏🐰</CardIcon>
            <Value value={getBalanceNumber(stakedBalance)} />
            <Label text={`${tokenName} ${TranslateString(332, 'Tokens Staked')}`} />
          </StyledCardHeader>
          <StyledCardActions>
            {!account && <UnlockButton fullWidth />}
            {isAllowed ? (
              <>
                <Button fullWidth disabled={stakedBalance.eq(new BigNumber(0))} onClick={onPresentWithdraw}>
                  {TranslateString(588, 'Unstake')}
                </Button>
                <StyledActionSpacer />
                <IconButton onClick={onPresentDeposit}>
                  <AddIcon color="background" />
                </IconButton>
              </>
            ) : (
              <Button fullWidth disabled={requestedApproval} onClick={handleApprove}>
                {`${TranslateString(564, 'Approve')} ${tokenName}`}
              </Button>
            )}
          </StyledCardActions>
        </StyledCardContentInner>
      </CardContent>
    </Card>
  )
}

const StyledCardHeader = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
`
const StyledCardActions = styled.div`
  display: flex;
  justify-content: center;
  margin-top: ${(props) => props.theme.spacing[6]}px;
  width: 100%;
`

const StyledActionSpacer = styled.div`
  height: ${(props) => props.theme.spacing[4]}px;
  width: ${(props) => props.theme.spacing[4]}px;
`

const StyledCardContentInner = styled.div`
  align-items: center;
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: space-between;
`

export default Stake
