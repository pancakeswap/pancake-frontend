import { useTranslation } from '@pancakeswap/localization'
import { Box, ButtonMenu, ButtonMenuItem, Flex, FlexGap } from '@pancakeswap/uikit'
import { useState } from 'react'
import { Campaign } from 'views/Home/components/Campaign'

export const Campaigns = () => {
  const { t } = useTranslation()
  const [activeButtonIndex, setActiveButtonIndex] = useState(0)
  const [statusButtonIndex, setStatusButtonIndex] = useState(0)

  const onActiveButtonChange = (newIndex: number) => {
    setActiveButtonIndex(newIndex)
  }

  const onStatusButtonChange = (newIndex: number) => {
    setStatusButtonIndex(newIndex)
  }

  return (
    <Box
      maxWidth={['1200px']}
      m={[
        '16px auto auto auto',
        '16px auto auto auto',
        '24px auto auto auto',
        '24px auto auto auto',
        '40px auto auto auto',
      ]}
      padding={['0 16px', '0 16px', '0 16px', '0 16px', '0 16px', '0 16px', '0']}
    >
      <Flex flexDirection={['column', 'column', 'row']} mb={['16px', '16px', '24px']}>
        <ButtonMenu scale="sm" activeIndex={activeButtonIndex} onItemClick={onActiveButtonChange} variant="subtle">
          <ButtonMenuItem>{t('Quests')}</ButtonMenuItem>
          <ButtonMenuItem>{t('Campaigns')}</ButtonMenuItem>
        </ButtonMenu>

        <ButtonMenu
          scale="sm"
          variant="subtle"
          m={['16px 0 0 0', '16px 0 0 0', '0 0 0 24px']}
          activeIndex={statusButtonIndex}
          onItemClick={onStatusButtonChange}
        >
          <ButtonMenuItem>{t('Ongoing')}</ButtonMenuItem>
          <ButtonMenuItem>{t('Upcoming')}</ButtonMenuItem>
          <ButtonMenuItem>{t('Finished')}</ButtonMenuItem>
        </ButtonMenu>
      </Flex>

      <FlexGap gap="16px" flexWrap="wrap">
        <Campaign />
        <Campaign />
        <Campaign />
      </FlexGap>
    </Box>
  )
}
