import React, { useState } from 'react'
import styled from 'styled-components'
import Button from '../../../components/Button'
import Card from '../../../components/Card'
import CardContent from '../../../components/CardContent'
import CardIcon from '../../../components/CardIcon'
import Label from '../../../components/Label'
import Value from '../../../components/Value'
import useEarnings from '../../../hooks/useEarnings'
import useReward from '../../../hooks/useReward'
import useSushi from '../../../hooks/useSushi'
import useTokenBalance from '../../../hooks/useTokenBalance'

import { getBalanceNumber } from '../../../utils/formatBalance'
import { getSyrupAddress } from '../../../sushi/utils'



const Harvest: React.FC = () => {
  const earnings = useEarnings(0)
  const [pendingTx, setPendingTx] = useState(false)
  // const { onReward } = useReward(pid)

  const sushi = useSushi()

  const syrupBalance = useTokenBalance(getSyrupAddress(sushi))

  return (
    <Card>
      <CardContent>
        <StyledCardContentInner>
          <StyledCardHeader>
            <CardIcon>🔸</CardIcon>
            <Value value={getBalanceNumber(syrupBalance)} />
            <Label text="SYRUP" />
          </StyledCardHeader>
          <StyledCardActions>
            <Button
              disabled={true}
              text={'To Vote'}
            />
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
  margin-right: 10px;
`

export default Harvest
