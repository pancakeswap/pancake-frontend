import React from 'react'
import styled from 'styled-components'
import { Flex, Heading, Text, Button, Link } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import { NavLink } from 'react-router-dom'
import useTheme from 'hooks/useTheme'
import PurpleWordHeading from './PurpleWordHeading'
import IconCard from './IconCard'

const TransparentFrame = styled.div`
  background: rgba(255, 255, 255, 0.6);
  padding: 40px;
  /* Light/card-border */

  border: 1px solid ${({ theme }) => theme.colors.cardBorder};
  box-sizing: border-box;
  backdrop-filter: blur(12px);
  border-radius: 72px;
`

const WinSection = () => {
  const { t } = useTranslation()
  const { theme } = useTheme()

  return (
    <TransparentFrame>
      <Flex flexDirection="column" alignItems="center" justifyContent="center">
        <PurpleWordHeading text={t('Win millions in prizes')} />
        <Text color="textSubtle">{t('Provably fair, on-chain games.')}</Text>
        <Text mb="40px" color="textSubtle">
          {t(' Win big with PancakeSwap.')}
        </Text>
        <IconCard />
      </Flex>
    </TransparentFrame>
  )
}

export default WinSection
