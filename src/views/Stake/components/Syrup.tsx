import React from 'react'
import styled from 'styled-components'
import { Button } from '@pancakeswap-libs/uikit'
import Card from '../../../components/Card'
import CardContent from '../../../components/CardContent'
import CardIcon from '../../../components/CardIcon'
import Label from '../../../components/Label'
import Value from '../../../components/Value'
import useTokenBalance from '../../../hooks/useTokenBalance'
import useI18n from '../../../hooks/useI18n'
import { getBalanceNumber } from '../../../utils/formatBalance'
import { getSyrupAddress } from '../../../sushi/utils'

const Harvest: React.FC = () => {
  const TranslateString = useI18n()
  const syrupBalance = useTokenBalance(getSyrupAddress())

  return (
    <Card>
      <CardContent>
        <StyledCardContentInner>
          <StyledCardHeader>
            <CardIcon>🥞</CardIcon>
            <Value value={getBalanceNumber(syrupBalance)} />
            <Label text="SYRUP" />
          </StyledCardHeader>
          <StyledCardActions>
            <Button fullWidth disabled>
              {TranslateString(566, 'Vote')}
            </Button>
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

const StyledCardContentInner = styled.div`
  align-items: center;
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: space-between;
  margin-right: 10px;
`

export default Harvest
