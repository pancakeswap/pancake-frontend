import React from 'react'
import styled from 'styled-components'
import { Text } from '@pancakeswap-libs/uikit'
import useI18n from 'hooks/useI18n'

export interface IfoCardDetailsProps {
  launchDate: string
  launchTime: string
  saleAmount: string
  raiseAmount: string
  cakeToBurn: string
  projectSiteUrl: string
}

const StyledIfoCardDetails = styled.div`
  margin-bottom: 24px;
`

const Item = styled.div`
  align-items: center;
  color: ${({ theme }) => theme.colors.secondary};
  display: flex;
`

const Display = styled(Text)`
  flex: 1;
`

const LaunchTimeValue = styled(Text)`
  span {
    color: ${({ theme }) => theme.colors.primary};
    margin-left: 4px;
  }
`

const ProjectLink = styled.div`
  color: ${({ theme }) => theme.colors.primary};
  font-weight: 600;
  text-align: center;
`

const IfoCardDetails: React.FC<IfoCardDetailsProps> = ({
  launchDate,
  launchTime,
  saleAmount,
  raiseAmount,
  cakeToBurn,
  projectSiteUrl,
}) => {
  const TranslateString = useI18n()

  return (
    <>
      <StyledIfoCardDetails>
        <Item>
          <Display>{TranslateString(999, 'Launch Time')}</Display>
          <LaunchTimeValue>
            {launchDate},<span>{launchTime}</span>
          </LaunchTimeValue>
        </Item>
        <Item>
          <Display>{TranslateString(999, 'For Sale')}</Display>
          <Text>{saleAmount}</Text>
        </Item>
        <Item>
          <Display>{TranslateString(999, 'To raise (USD)')}</Display>
          <Text>{raiseAmount}</Text>
        </Item>
        <Item>
          <Display>{TranslateString(999, 'CAKE to burn (USD)')}</Display>
          <Text>{cakeToBurn}</Text>
        </Item>
      </StyledIfoCardDetails>
      <ProjectLink>
        <a href={projectSiteUrl} target="_blank" rel="noreferrer">
          {TranslateString(412, 'View project site')}
        </a>
      </ProjectLink>
    </>
  )
}

export default IfoCardDetails
