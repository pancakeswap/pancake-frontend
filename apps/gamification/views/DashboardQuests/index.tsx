import { useTranslation } from '@pancakeswap/localization'
import { AddIcon, Box, Button, ButtonMenu, ButtonMenuItem, Flex, Text, useMatchBreakpoints } from '@pancakeswap/uikit'
import { useState } from 'react'
import { styled } from 'styled-components'

const Container = styled(Box)`
  padding: 24px;
  background: ${({ theme }) =>
    theme.isDark
      ? 'linear-gradient(0deg, #3D2A54 0%, #313D5C 100%)'
      : 'linear-gradient(0deg, #f1eeff 0%, #e9f6ff 100%)'};

  ${({ theme }) => theme.mediaQueries.lg} {
    padding: 40px 0;
  }
`

const IconButton = styled(Button)`
  display: block;
  align-self: center;

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
        <Flex maxWidth={['1200px']} margin="auto">
          <Flex>
            <Text fontSize={['36px']} bold>
              {t('Guests')}
            </Text>
            <IconButton scale="sm" endIcon={<AddIcon color="white" />} />
          </Flex>
          <Flex alignItems={['center']}>
            <ButtonMenu
              scale="sm"
              variant="subtle"
              m={['16px 0 0 0', '16px 0 0 0', '0']}
              activeIndex={statusButtonIndex}
              onItemClick={onStatusButtonChange}
            >
              <ButtonMenuItem>{t('Ongoing')}</ButtonMenuItem>
              <ButtonMenuItem>{t('Upcoming')}</ButtonMenuItem>
              <ButtonMenuItem>{t('Finished')}</ButtonMenuItem>
            </ButtonMenu>
            <Button display={['none', 'none', 'flex']} ml="auto" scale="sm" endIcon={<AddIcon color="white" />}>
              {isTablet ? t('Create') : t('Create a quest')}
            </Button>
          </Flex>
        </Flex>
      </Container>
    </Flex>
  )
}
