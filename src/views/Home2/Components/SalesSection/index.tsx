import React from 'react'
import { Flex, Heading, Text, Button, Link } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import { NavLink } from 'react-router-dom'
import useTheme from 'hooks/useTheme'
import CompositeImage from './CompositeImage'

interface SalesSectionButton {
  to: string
  text: string
  external: boolean
}

interface SalesSectionImage {
  src: string
  alt: string
}

export interface SalesSectionProps {
  headingText: string
  bodyText: string
  reverse: boolean
  primaryButton: SalesSectionButton
  secondaryButton: SalesSectionButton
  images: SalesSectionImage[]
}

const SalesSection: React.FC<SalesSectionProps> = (props) => {
  const { t } = useTranslation()
  const { theme } = useTheme()

  const { headingText, bodyText, reverse, primaryButton, secondaryButton, images } = props

  const headingTranslatedText = t(headingText)
  const bodyTranslatedText = t(bodyText)
  const split = headingTranslatedText.split(' ')
  const first = split[0]
  const rest = split.slice(1).join(' ')

  return (
    <Flex flexDirection="column">
      <Flex flexDirection={reverse ? 'row-reverse' : 'row'} alignItems="center" justifyContent="center">
        <Flex flexDirection="column" flex="1" ml={reverse && '64px'} mr={!reverse && '64px'}>
          <Heading scale="xl" mb="24px">
            <span style={{ color: theme.colors.secondary }}>{first} </span>
            {rest}
          </Heading>
          <Text color="textSubtle" mb="24px">
            {bodyTranslatedText}
          </Text>
          <Flex>
            <Link mr="16px" external={primaryButton.external} href={primaryButton.to}>
              <Button>
                <Text color="card" bold fontSize="16px">
                  {t(primaryButton.text)}
                </Text>
              </Button>
            </Link>
            <Link external={secondaryButton.external} href={secondaryButton.to}>
              {t(secondaryButton.text)}
            </Link>
          </Flex>
        </Flex>
        <Flex flexDirection="column" flex="1">
          <CompositeImage images={images} />
        </Flex>
      </Flex>
    </Flex>
  )
}

export default SalesSection
