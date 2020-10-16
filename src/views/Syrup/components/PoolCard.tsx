import BigNumber from 'bignumber.js'
import React, { useCallback, useState } from 'react'
import styled from 'styled-components'
import { useWallet } from 'use-wallet'
import { Contract } from 'web3-eth-contract'
import Button from '../../../components/Button'
import HarvestButton from './HarvestButton'
import Card from '../../../components/Card'
import CardIcon from '../../../components/CardIcon'
import IconButton from '../../../components/IconButton'
import { AddIcon } from '../../../components/icons'
import Label from '../../../components/Label'
import Value from '../../../components/Value'

import { useSousAllowance } from '../../../hooks/useAllowance'
import { useSousApprove } from '../../../hooks/useApprove'
import {useSousEarnings, useSousLeftBlocks} from '../../../hooks/useEarnings'
import useModal from '../../../hooks/useModal'
import useStake, {useSousStake} from '../../../hooks/useStake'
import {useSousStakedBalance, useSousTotalStaked} from '../../../hooks/useStakedBalance'
import useTokenBalance from '../../../hooks/useTokenBalance'
import useUnstake, {useSousUnstake} from '../../../hooks/useUnstake'
import { getBalanceNumber } from '../../../utils/formatBalance'
import {useSousReward} from '../../../hooks/useReward'

import SmallValue from './Value'
import DepositModal from './DepositModal'
import WithdrawModal from './WithdrawModal'
import CardContent from './CardContent'

import WalletProviderModal from '../../../components/WalletProviderModal'
import AccountModal from '../../../components/TopBar/components/AccountModal'


interface HarvestProps {
  syrup: Contract
  tokenName: string
  sousId: number
  projectLink: string
  harvest:  boolean
}

const PoolCard: React.FC<HarvestProps> = ({ syrup, sousId, tokenName, projectLink, harvest }) => {
  const [requestedApproval, setRequestedApproval] = useState(false)
  const { account } = useWallet()
  const allowance = useSousAllowance(syrup, sousId)
  const { onApprove } = useSousApprove(syrup, sousId)
  const leftBlockText = useSousLeftBlocks(sousId)
  const tokenBalance = useTokenBalance(syrup.options.address)
  const stakedBalance = useSousStakedBalance(sousId)
  const totalStaked = useSousTotalStaked(sousId)
  const earnings = useSousEarnings(sousId)

  const { onStake } = useSousStake(sousId)
  const { onUnstake } = useSousUnstake(sousId)

  const [pendingTx, setPendingTx] = useState(false)
  const { onReward } = useSousReward(sousId)

  const [onPresentDeposit] = useModal(
    <DepositModal
      max={tokenBalance}
      onConfirm={onStake}
      tokenName={'SYRUP'}
    />,
  )

  const [onPresentWithdraw] = useModal(
    <WithdrawModal
      max={stakedBalance}
      onConfirm={onUnstake}
      tokenName={'SYRUP'}
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
      console.log(e)
    }
  }, [onApprove, setRequestedApproval])

  const [onPresentAccountModal] = useModal(<AccountModal />)
  const [onPresentWalletProviderModal] = useModal(
    <WalletProviderModal />,
    'provider',
  )
  const handleUnlockClick = useCallback(() => {
    onPresentWalletProviderModal()
  }, [onPresentWalletProviderModal])

  return (
    <Card>
      <CardContent>
        <StyledCardContentInner>
          <StyledCardHeader>
            <Title finished={leftBlockText==='finished'}>{tokenName} Pool</Title>
            <TokenLink href={projectLink} target="_blank">Project Site &gt; </TokenLink>
          </StyledCardHeader>
          <StyledCardContent>
            <img src={require(`../../../assets/img/${tokenName}.png`)} alt="" />
            <Value value={getBalanceNumber(earnings)} />
            <Label text={`${tokenName} earned`} />
          </StyledCardContent>

          <StyledCardActions>
            {!account &&  <Button onClick={handleUnlockClick} size="md" text="Unlock Wallet" />}
            {
              account && harvest &&
              <HarvestButton
                disabled={!earnings.toNumber() || pendingTx}
                text={pendingTx ? 'Collecting' : 'Harvest'}
                onClick={async () => {
                  setPendingTx(true)
                  await onReward()
                  setPendingTx(false)
                }}
              />
            }
            { account &&  (!allowance.toNumber()  && getBalanceNumber(stakedBalance) == 0? (
              <Button
                disabled={leftBlockText==='finished' ||  requestedApproval}
                onClick={handleApprove}
                text={`Approve SYRUP`}
              />
            ) : (
              <>
                <Button
                  disabled={stakedBalance.eq(new BigNumber(0))}
                  text="Unstake SYRUP"
                  onClick={onPresentWithdraw}
                />
                <StyledActionSpacer />
                <IconButton disabled={leftBlockText==='finished'} onClick={onPresentDeposit}>
                  <AddIcon/>
                </IconButton>
              </>
            ))}
          </StyledCardActions>

          <StyledLabel text="🍯Your Stake" value={getBalanceNumber(stakedBalance)} />

          <StyledCardFooter>
            <p>
              Total SYRUP staked: <SmallValue value={getBalanceNumber(totalStaked)} /> <br/>
             {leftBlockText}
            </p>
          </StyledCardFooter>
        </StyledCardContentInner>
      </CardContent>
    </Card>
  )
}

const StyledCardFooter = styled.div`
  border-top: 1px solid rgb(118 69 217 / 0.2);
  width: 100%;
  padding: 5px 20px;
  box-sizing: border-box;
  font-size: 14px;
`

const StyledCardContent = styled.div`
  text-align:  center;
  padding: 10px 20px;
  img {
    width: 60px;
    padding: 15px;
  }
`
interface StyledButtonProps {
  finished?: boolean
}


const Title = styled.div<StyledButtonProps>`
  color: ${(props) => (props.finished ? '#acaaaf' : props.theme.colors.primary)};
  font-size: 20px;
  font-weight: 900;
  line-height: 70px;
`

const TokenLink = styled.a`
  line-height: 70px;
  font-size: 14px;
  text-decoration: none;
  color: #12AAB5;
`

const StyledCardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box;
  border-bottom: 1px solid rgb(118 69 217 / 0.2);
`
const StyledCardActions = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 10px;
  width: 100%;
  padding: 10px 20px;
  box-sizing: border-box;
`

const StyledActionSpacer = styled.div`
  height: ${(props) => props.theme.spacing[4]}px;
  width: ${(props) => props.theme.spacing[4]}px;
`

const StyledSpacer = styled.div`
  height: ${(props) => props.theme.spacing[4]}px;
  width: ${(props) => props.theme.spacing[4]}px;
`

const StyledCardContentInner = styled.div`
  align-items: center;
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: space-between;
  position: relative;
`


interface StyledLabelProps {
  value: number
  text: string
}

const StyledLabel: React.FC<StyledLabelProps> = ({ value, text }) => {

  return (
    <StyledValue>
      <p>{text}</p>
      <SmallValue value={value}/>
    </StyledValue>
  )
}

const StyledValue = styled.div`
  font-family: 'Roboto Mono', monospace;
  color: ${(props) => props.theme.colors.secondary};
  font-size: 16px;
  font-weight: 900;
  display: flex;
  justify-content: space-between;
  line-height: 30px;
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box;

`

export default PoolCard
