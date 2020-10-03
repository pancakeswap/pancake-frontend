import BigNumber from 'bignumber.js'
import React, { useCallback, useState } from 'react'
import styled from 'styled-components'
import { useWallet } from 'use-wallet'
import { Contract } from 'web3-eth-contract'
import Button from '../../../components/Button'
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

import SmallValue from './Value'
import DepositModal from './DepositModal'
import WithdrawModal from './WithdrawModal'
import CardContent from './CardContent'

import WalletProviderModal from '../../../components/WalletProviderModal'
import AccountModal from '../../../components/TopBar/components/AccountModal'

const Coming: React.FC = () => {

  return (
    <Card>
      <CardContent>
        <StyledCardContentInner>
          <StyledCardHeader>
            <Title>Coming Soon 👀</Title>
          </StyledCardHeader>
          <StyledCardContent>
            <CardIcon>⏳</CardIcon>
            <Value value={'???'} />
            <Label text={`??? earned`} />
          </StyledCardContent>

          <StyledCardActions>
            <Button
              disabled={true}
              text={`Coming soon...`}
            />
          </StyledCardActions>

          <StyledLabel text="🍯Your Stake" value={0} />

          <StyledCardFooter>
            <p>
              Total SYRUP staked: 0 <br/>
             Farming starts in ??? Blocks
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

const Title = styled.div`
  color: ${(props) => props.theme.colors.primary};
  font-size: 20px;
  font-weight: 900;
  line-height: 70px;
`

const TokenLink = styled.a`
  line-height: 70px;
  font-size: 14px;
  text-decoration: none;
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
  margin-top: 20px;
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

export default Coming
