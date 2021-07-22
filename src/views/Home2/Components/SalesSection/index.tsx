import React from 'react'
import { Flex, Text, Button, Link } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import CompositeImage, { CompositeImageProps } from '../CompositeImage'
import PurpleWordHeading from '../PurpleWordHeading'

interface SalesSectionButton {
  to: string
  text: string
  external: boolean
}

export interface SalesSectionProps {
  headingText: string
  bodyText: string
  reverse: boolean
  primaryButton: SalesSectionButton
  secondaryButton: SalesSectionButton
  images: CompositeImageProps
}

const SalesSection: React.FC<SalesSectionProps> = (props) => {
  const { t } = useTranslation()

  const { headingText, bodyText, reverse, primaryButton, secondaryButton, images } = props

  const headingTranslatedText = t(headingText)
  const bodyTranslatedText = t(bodyText)

  return (
    <Flex flexDirection="column">
      <Flex flexDirection={reverse ? 'row-reverse' : 'row'} alignItems="center" justifyContent="center">
        <Flex flexDirection="column" flex="1" ml={reverse && '64px'} mr={!reverse && '64px'}>
          <PurpleWordHeading text={headingTranslatedText} />
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
          <CompositeImage {...images} />
        </Flex>
      </Flex>
    </Flex>
  )
}

export default SalesSection
