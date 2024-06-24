import { useTranslation } from '@pancakeswap/localization'
import { Box, Flex, Link, OpenNewIcon, Text } from '@pancakeswap/uikit'
import Image from 'next/image'
import React from 'react'
import { styled } from 'styled-components'
import { GradientBox } from 'views/Campaigns/components/GradientBox'

const Container = styled(Flex)`
  position: relative;
  flex-wrap: wrap;

  > div {
    display: none;
    width: 100%;
    margin-bottom: 24px;
  }

  > div:first-child {
    display: block;
  }

  ${({ theme }) => theme.mediaQueries.sm} {
    > div {
      width: calc(50% - 12px);
      margin-right: 24px;
    }

    > div:nth-child(2) {
      display: block;
      margin-right: 0;
    }
  }

  ${({ theme }) => theme.mediaQueries.md} {
    > div {
      width: calc(33.33% - 16px);
      margin-right: 24px;
    }

    > div:nth-child(2) {
      margin-right: 24px;
    }

    > div:nth-child(3) {
      display: block;
      margin-right: 0;
    }
  }

  ${({ theme }) => theme.mediaQueries.xl} {
    > div {
      display: block;
      width: calc(25% - 18px);
      margin-right: 24px;
    }

    > div:nth-child(3) {
      margin-right: 24px;
    }

    > div:nth-child(4) {
      margin-right: 0;
    }
  }
`

interface EmptyQuestProps {
  title: string
  subTitle: string
  showQuestLink?: boolean
  showCampaignLink?: boolean
}

export const EmptyQuest: React.FC<EmptyQuestProps> = ({ title, subTitle, showQuestLink, showCampaignLink }) => {
  const { t } = useTranslation()
  return (
    <Box mt="40px">
      <Container>
        <GradientBox />
        <GradientBox />
        <GradientBox />
        <GradientBox />
      </Container>
      <Flex mt="-100px" width="100%">
        <Flex flexDirection="column" width="100%">
          <Box margin="auto">
            <Image src="/images/empty-quest-icon.png" width={116} height={91} alt="empty-quest-icon" />
          </Box>
          <Text m="8px 0" textAlign="center" bold fontSize={['16px', '16px', '20px']}>
            {title}
          </Text>
          <Text textAlign="center" fontSize={['14px', '14px', '16px']} color="textSubtle">
            {subTitle}
          </Text>
          {(showQuestLink || showCampaignLink) && (
            <Flex justifyContent="center" mt="12px">
              <Link href="/quests">{t('Explore Quests')}</Link>
              {showCampaignLink && (
                <>
                  <Text m="0 4px" bold color="primary">
                    &
                  </Text>
                  <Link href="/quests">{t('Campaign')}</Link>
                </>
              )}
              <OpenNewIcon ml="4px" width={20} height={20} color="primary" />
            </Flex>
          )}
        </Flex>
      </Flex>
    </Box>
  )
}
