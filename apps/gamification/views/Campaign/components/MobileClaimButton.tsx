import { useTranslation } from '@pancakeswap/localization'
// import { Box, Button, Flex, LogoRoundIcon, Text, useMatchBreakpoints, InfoIcon } from '@pancakeswap/uikit'
import { Box, Button, Flex, LogoRoundIcon, Text, useMatchBreakpoints } from '@pancakeswap/uikit'
import throttle from 'lodash/throttle'
import { useEffect, useState } from 'react'
import { styled } from 'styled-components'
import { CLAIM_BUTTON_ID } from 'views/Campaign/components/Reward/ClaimButton'

const MobileClaimButtonContainer = styled(Box)`
  position: fixed;
  left: 0;
  z-index: 10;
  bottom: 50px;
  width: 100%;
  padding: 12px 16px;
  background-color: ${({ theme }) => theme.card.background};
  border-top: solid 1px ${({ theme }) => theme.colors.cardBorder};
`

const StyledButton = styled(Button)`
  padding: 0 20px;
  border-radius: 24px;
`

export const MobileClaimButton = () => {
  const { t } = useTranslation()
  const [visible, setVisible] = useState(false)
  const { isMobile, isTablet } = useMatchBreakpoints()

  useEffect(() => {
    const toggleVisible = () => {
      const scrolled = document.documentElement.scrollTop
      const claimButtonHeight = document.getElementById(CLAIM_BUTTON_ID)?.offsetTop ?? 0

      if (scrolled > claimButtonHeight + 280) {
        setVisible(true)
      } else {
        setVisible(false)
      }
    }

    const throttledToggleVisible = throttle(toggleVisible, 200)
    window.addEventListener('scroll', throttledToggleVisible)
    return () => window.removeEventListener('scroll', throttledToggleVisible)
  }, [])

  if ((!isMobile && !isTablet) || !visible) {
    return null
  }

  return (
    <MobileClaimButtonContainer>
      <Flex justifyContent="space-between">
        <Flex>
          <LogoRoundIcon width="48px" height="48px" />
          <Box ml="8px">
            <Text bold fontSize="28px" lineHeight="32px">
              900
            </Text>
            <Text bold fontSize="14px" lineHeight="16px">
              Token2
            </Text>
          </Box>
        </Flex>
        <StyledButton>{t('Claim the reward')}</StyledButton>
        {/* <StyledButton disabled endIcon={<InfoIcon color="textDisabled" />}>
          {t('Unavailable')}
        </StyledButton> */}
      </Flex>
    </MobileClaimButtonContainer>
  )
}
