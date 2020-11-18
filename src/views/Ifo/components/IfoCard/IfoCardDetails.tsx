import React from 'react'
import styled from 'styled-components'
import { Text, OpenNewIcon, Link } from '@pancakeswap-libs/uikit'
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

const ProjectLink = styled.div`
  align-items: center;
  color: ${({ theme }) => theme.colors.primary};
  display: flex;
  font-weight: 600;
  justify-content: center;
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
          <Text>
            {launchDate},
            <Link
              href="https://www.worldtimebuddy.com/event?lid=1880252&h=1880252&sts=26763360&sln=21-22&a=show&euid=505bcb85-76e9-e614-ad1d-0f6fe15ed548"
              target="blank"
              rel="noopener noreferrer"
              ml="4px"
              style={{ display: 'inline' }}
            >
              {launchTime}
            </Link>
          </Text>
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
        <OpenNewIcon color="primary" ml="4px" />
      </ProjectLink>
    </>
  )
}

export default IfoCardDetails
