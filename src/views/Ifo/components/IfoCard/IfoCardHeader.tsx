import React from 'react'
import styled from 'styled-components'
import { Heading, Text } from '@pancakeswap-libs/uikit'

interface IfoCardHeaderProps {
  ifoId: string
  name: string
  subTitle: string
}

const StyledIfoCardHeader = styled.div`
  align-items: center;
  display: flex;
  margin-bottom: 32px;
`

const Details = styled.div`
  flex: 1;
`

const Name = styled(Heading).attrs({ as: 'h3', size: 'lg' })`
  margin-bottom: 4px;
  text-align: right;
`

const Description = styled(Text)`
  color: ${({ theme }) => theme.colors.textSubtle};
  font-size: 14px;
  text-align: right;
`

const IfoCardHeader: React.FC<IfoCardHeaderProps> = ({ ifoId, name, subTitle }) => {
  return (
    <StyledIfoCardHeader>
      <img src={`/images/ifos/${ifoId}.svg`} alt={ifoId} />
      <Details>
        <Name>{name}</Name>
        <Description>{subTitle}</Description>
      </Details>
    </StyledIfoCardHeader>
  )
}

export default IfoCardHeader
