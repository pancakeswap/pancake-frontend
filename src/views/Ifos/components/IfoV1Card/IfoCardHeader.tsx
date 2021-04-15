import React from 'react'
import styled from 'styled-components'
import { Heading, Text, Flex } from '@pancakeswap-libs/uikit'

interface IfoCardHeaderProps {
  ifoId: string
  name: string
  subTitle: string
}

const StyledIfoCardHeader = styled(Flex)`
  & > div {
    flex: 1;
  }
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
    <StyledIfoCardHeader mb="24px" alignItems="center">
      <img src={`/images/ifos/${ifoId}.svg`} alt={ifoId} width="64px" height="64px" />
      <div>
        <Name>{name}</Name>
        <Description>{subTitle}</Description>
      </div>
    </StyledIfoCardHeader>
  )
}

export default IfoCardHeader
