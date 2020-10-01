import React, { useState, useEffect } from 'react'
import { useWallet } from 'use-wallet'
import { Contract } from 'web3-eth-contract'
import BigNumber from 'bignumber.js'

import styled from 'styled-components'
import Button from '../../../components/Button'
import Card from '../../../components/Card'
import CardContent from '../../../components/CardContent'
import CardIcon from '../../../components/CardIcon'
import Label from '../../../components/Label'
import Value from '../../../components/Value'
import { getBalanceNumber } from '../../../utils/formatBalance'
import { useSousTotalStaked} from '../../../hooks/useStakedBalance'

interface HarvestProps {
  syrup: Contract
  tokenName: string
  sousId: number
}

const Harvest: React.FC<HarvestProps> = ({ syrup, tokenName, sousId }) => {
  const totalStaked = useSousTotalStaked(sousId)

  return (
    <Card>
      <CardContent>
        <StyledCardContentInner>
          <StyledCardHeader>
            <CardIcon>🍯</CardIcon>
            <Value value={getBalanceNumber(totalStaked)} />
            <Label text="Total Syrup Staked" />
          </StyledCardHeader>
          <StyledCardActions>

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

export default Harvest
