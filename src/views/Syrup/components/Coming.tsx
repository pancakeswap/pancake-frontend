/* eslint-disable jsx-a11y/accessible-emoji */
import React from 'react'
import styled from 'styled-components'
import Button from '../../../components/Button'
import Card from '../../../components/Card'
import CardIcon from '../../../components/CardIcon'
import Label from '../../../components/Label'
import Value from '../../../components/Value'

import SmallValue from './Value'
import CardContent from './CardContent'
import { TranslateString } from '../../../utils/translateTextHelpers'

const Coming: React.FC = () => {
  return (
    <Card>
      <CardContent>
        <StyledCardContentInner>
          <StyledCardHeader>
            <Title>{TranslateString(350, 'Coming Soon')} 👀</Title>
          </StyledCardHeader>
          <StyledCardContent>
            <CardIcon>⏳</CardIcon>
            <Value value={'???'} />
            <Label text={TranslateString(330, '??? Earned')} />
          </StyledCardContent>

          <StyledCardActions>
            <Button
              disabled={true}
              text={TranslateString(350, 'Coming Soon')}
            />
          </StyledCardActions>

          <StyledLabel text="🍯Your Stake" value={0} />

          <StyledCardFooter>
            <div>
              <div>
                {TranslateString(352, 'APY')}:&nbsp;
                <SmallValue value="-" />
              </div>
              {TranslateString(364, 'Total SYRUP staked')}: 0 <br />
              Farming starts in ??? Blocks
            </div>
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
  text-align: center;
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
      <SmallValue value={value} />
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
