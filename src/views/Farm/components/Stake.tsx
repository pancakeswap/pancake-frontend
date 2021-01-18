import React, { useCallback, useState } from 'react'
import BigNumber from 'bignumber.js'
import styled from 'styled-components'
import { useWallet } from '@binance-chain/bsc-use-wallet'
import { Contract } from 'web3-eth-contract'
import { Button, IconButton, useModal, AddIcon, Card, CardBody, Image } from '@pancakeswap-libs/uikit'
import Label from 'components/Label'
import { useApprove } from 'hooks/useApprove'
import useStake from 'hooks/useStake'
import useI18n from 'hooks/useI18n'
import useUnstake from 'hooks/useUnstake'
import { getBalanceNumber } from 'utils/formatBalance'
import UnlockButton from 'components/UnlockButton'
import DepositModal from './DepositModal'
import WithdrawModal from './WithdrawModal'
import Value from './Value'

interface StakeProps {
  lpContract: Contract
  pid: number
  tokenName: string
  allowance: BigNumber
  tokenBalance: BigNumber
  stakedBalance: BigNumber
}

const Stake: React.FC<StakeProps> = ({ lpContract, pid, tokenName, allowance, tokenBalance, stakedBalance }) => {
  const { account } = useWallet()
  const [requestedApproval, setRequestedApproval] = useState(false)
  const TranslateString = useI18n()

  const { onApprove } = useApprove(lpContract)
  const { onStake } = useStake(pid)
  const { onUnstake } = useUnstake(pid)

  const [onPresentDeposit] = useModal(<DepositModal max={tokenBalance} onConfirm={onStake} tokenName={tokenName} />)
  const [onPresentWithdraw] = useModal(
    <WithdrawModal max={stakedBalance} onConfirm={onUnstake} tokenName={tokenName} />,
  )

  const handleApprove = useCallback(async () => {
    try {
      setRequestedApproval(true)
      await onApprove()
      setRequestedApproval(false)
    } catch (e) {
      console.error(e)
    }
  }, [onApprove])

  // We assume the token name is coin pair + lp e.g. CAKE-BNB LP, LINK-BNB LP,
  // NAR-CAKE LP. The images should be cake-bnb.svg, link-bnb.svg, nar-cake.svg
  const farmImage = tokenName.split(' ')[0].toLocaleLowerCase()
  const isAllowed = account && allowance && allowance.isGreaterThan(0)

  return (
    <Card>
      <CardBody>
        <StyledCardContentInner>
          <StyledCardHeader>
            <Image src={`/images/farms/${farmImage}.svg`} alt={`${tokenName} logo`} width={48} height={48} mb="16px" />
            <Value
              value={getBalanceNumber(stakedBalance)}
              decimals={tokenName === 'HARD' ? 6 : undefined}
              fontSize="40px"
            />
            <Label text={`${tokenName} ${TranslateString(332, 'Tokens Staked')}`} />
          </StyledCardHeader>
          <StyledCardActions>
            {!account && <UnlockButton />}
            {account &&
              (isAllowed ? (
                <>
                  <Button disabled={stakedBalance.eq(new BigNumber(0))} onClick={onPresentWithdraw}>
                    {TranslateString(292, 'Unstake')}
                  </Button>
                  <StyledActionSpacer />
                  <IconButton onClick={onPresentDeposit}>
                    <AddIcon color="background" />
                  </IconButton>
                </>
              ) : (
                <Button disabled={requestedApproval} onClick={handleApprove}>{`Approve ${tokenName}`}</Button>
              ))}
          </StyledCardActions>
        </StyledCardContentInner>
      </CardBody>
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
