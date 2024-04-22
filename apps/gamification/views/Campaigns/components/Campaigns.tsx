import { useTranslation } from '@pancakeswap/localization'
import { Box, ButtonMenu, ButtonMenuItem, Flex, FlexGap } from '@pancakeswap/uikit'
import { useState } from 'react'
import { styled } from 'styled-components'
import { Campaign } from 'views/Campaigns/components/Campaign'

const StyledFlexGap = styled(FlexGap)`
  flex-wrap: wrap;
  gap: 16px;
  margin-bottom: 16px;

  > a {
    width: 264px;
    margin: auto;

    &:hover {
      text-decoration: none;

      .thumbnail {
        transform: scale(1.1);
      }
    }
  }

  ${({ theme }) => theme.mediaQueries.sm} {
    > a {
      width: calc(50% - 8px);
      margin: 0;
    }
  }

  ${({ theme }) => theme.mediaQueries.lg} {
    > a {
      width: calc(33.33% - 11px);
    }

    > a:nth-child(1),
    > a:nth-child(2) {
      width: calc(50% - 11px);
    }
  }

  ${({ theme }) => theme.mediaQueries.xl} {
    > a {
      width: calc(25% - 12px);
    }

    > a:nth-child(1),
    > a:nth-child(2),
    > a:nth-child(3) {
      width: calc(33.33% - 11px);
    }
  }
`

export const Campaigns = () => {
  const { t } = useTranslation()
  const [statusButtonIndex, setStatusButtonIndex] = useState(0)

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
      </Flex>

      <StyledFlexGap>
        <Campaign />
        <Campaign />
        <Campaign />
        <Campaign />
        <Campaign />
        <Campaign />
        <Campaign />
      </StyledFlexGap>
    </Box>
  )
}
