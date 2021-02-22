import React, { useState } from 'react'
import styled from 'styled-components'
import BigNumber from 'bignumber.js'
import {
  Text,
  LinkExternal,
  Link,
  Box,
  CardFooter,
  Button,
  ChevronDownIcon,
  ChevronUpIcon,
} from '@pancakeswap-libs/uikit'
import useI18n from 'hooks/useI18n'

export interface IfoCardDetailsProps {
  description: string
  launchDate: string
  launchTime: string
  saleAmount: string
  raiseAmount: string
  cakeToBurn: string
  projectSiteUrl: string
  raisingAmount: BigNumber
  totalAmount: BigNumber
}

const Item = styled.div`
  align-items: center;
  color: ${({ theme }) => theme.colors.secondary};
  display: flex;
`

const Display = styled(Text)`
  flex: 1;
`

const IfoCardDetails: React.FC<IfoCardDetailsProps> = ({
  description,
  launchDate,
  launchTime,
  saleAmount,
  raiseAmount,
  cakeToBurn,
  projectSiteUrl,
  raisingAmount,
  totalAmount,
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const TranslateString = useI18n()

  const handleToggle = () => setIsOpen(!isOpen)

  return (
    <CardFooter>
      <Button
        variant="text"
        onClick={handleToggle}
        fullWidth
        endIcon={
          isOpen ? <ChevronUpIcon color="primary" width="24px" /> : <ChevronDownIcon color="primary" width="24px" />
        }
      >
        {isOpen ? TranslateString(1066, 'Hide') : TranslateString(658, 'Details')}
      </Button>
      {isOpen && (
        <>
          <Text as="p" color="textSubtle" my="24px">
            {description}
          </Text>
          <Box mb="24px">
            <Item>
              <Display>{TranslateString(582, 'Launch Time')}</Display>
              <Text>
                {launchDate},
                <Link
                  href="https://www.timeanddate.com/worldclock/singapore/singapore"
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
              <Display>{TranslateString(584, 'For Sale')}</Display>
              <Text>{saleAmount}</Text>
            </Item>
            <Item>
              <Display>{TranslateString(999, 'To raise (USD)')}</Display>
              <Text>{raiseAmount}</Text>
            </Item>
            <Item>
              <Display>{TranslateString(586, 'CAKE to burn (USD)')}</Display>
              <Text>{cakeToBurn}</Text>
            </Item>
            <Item>
              <Display>{TranslateString(999, 'Total raised (% of target)')}</Display>
              <Text>{`${totalAmount.div(raisingAmount).times(100).toFixed(2)}%`}</Text>
            </Item>
          </Box>
          <LinkExternal href={projectSiteUrl} style={{ margin: 'auto' }}>
            {TranslateString(412, 'View project site')}
          </LinkExternal>
        </>
      )}
    </CardFooter>
  )
}

export default IfoCardDetails
