import { useTranslation } from '@pancakeswap/localization'
import { AddIcon, Box, Button, ButtonMenu, ButtonMenuItem, Flex, Text, useMatchBreakpoints } from '@pancakeswap/uikit'
import { useState } from 'react'
import { styled } from 'styled-components'
import { Record } from 'views/DashboardQuests/components/Record'

const Container = styled(Box)`
  padding: 24px;
  background: ${({ theme }) =>
    theme.isDark
      ? 'linear-gradient(0deg, #3D2A54 0%, #313D5C 100%)'
      : 'linear-gradient(0deg, #f1eeff 0%, #e9f6ff 100%)'};

  ${({ theme }) => theme.mediaQueries.lg} {
    padding: 40px 24px;
  }
`

const IconButton = styled(Button)`
  display: block;
  align-self: center;
  margin-left: auto;

  > svg {
    margin-left: 0;
  }

  ${({ theme }) => theme.mediaQueries.sm} {
    display: none;
  }
`

export const DashboardQuests = () => {
  const { t } = useTranslation()
  const { isTablet } = useMatchBreakpoints()

  const [statusButtonIndex, setStatusButtonIndex] = useState(0)

  const onStatusButtonChange = (newIndex: number) => {
    setStatusButtonIndex(newIndex)
  }

  return (
    <Flex flexDirection="column">
      <Container>
        <Flex flexDirection={['column', 'column', 'column', 'column', 'row']} maxWidth={['1200px']} margin="auto">
          <Flex>
            <Text fontSize={['36px']} bold>
              {t('Guests')}
            </Text>
            <IconButton scale="sm" endIcon={<AddIcon color="white" />} />
          </Flex>
          <Flex width="100%" alignItems={['flex-start', 'flex-start', 'flex-start', 'flex-start', 'center']}>
            <ButtonMenu
              scale="sm"
              m={['0', '0', '0 auto 0 0', '0 auto 0 0', 'auto']}
              variant="subtle"
              activeIndex={statusButtonIndex}
              onItemClick={onStatusButtonChange}
            >
              <ButtonMenuItem>{t('Ongoing')}</ButtonMenuItem>
              <ButtonMenuItem>{t('Scheduled')}</ButtonMenuItem>
              <ButtonMenuItem>{t('Finished')}</ButtonMenuItem>
              <ButtonMenuItem>{t('Drafted')}</ButtonMenuItem>
            </ButtonMenu>
            <Button display={['none', 'none', 'flex']} scale="sm" endIcon={<AddIcon color="white" />}>
              {isTablet ? t('Create') : t('Create a quest')}
            </Button>
          </Flex>
        </Flex>
      </Container>
      <Record />
    </Flex>
  )
}
