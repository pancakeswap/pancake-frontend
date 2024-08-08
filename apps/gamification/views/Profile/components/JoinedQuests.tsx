import { ChainId } from '@pancakeswap/chains'
import { useTranslation } from '@pancakeswap/localization'
import { Box, ButtonMenu, ButtonMenuItem, Flex, FlexGap } from '@pancakeswap/uikit'
import { NetworkMultiSelector, defaultValueChains } from 'components/NetworkMultiSelector'
import { SpinnerWithLoadingText } from 'components/SpinnerWithLoadingText'
import { useState } from 'react'
import useInfiniteScroll from 'react-infinite-scroll-hook'
import { styled } from 'styled-components'
import { useUserJoinedPublicQuests } from 'views/Profile/hooks/useUserJoinedPublicQuests'
import { EmptyQuest } from 'views/Quests/components/EmptyQuest'
import { Quest } from 'views/Quests/components/Quest'
import { publicConvertIndexToStatus } from 'views/Quests/utils/publicConvertIndexToStatus'

const StyledFlexGap = styled(FlexGap)`
  flex-wrap: wrap;
  gap: 16px;
  margin-bottom: 16px;

  > div {
    width: 100%;
    margin: auto;
  }

  ${({ theme }) => theme.mediaQueries.sm} {
    > div {
      width: calc(50% - 8px);
      margin: 0;
    }
  }

  ${({ theme }) => theme.mediaQueries.lg} {
    > div {
      width: calc(33.33% - 11px);
    }
  }

  ${({ theme }) => theme.mediaQueries.xl} {
    > div {
      width: calc(25% - 12px);
    }
  }
`

export const JoinedQuests = () => {
  const { t } = useTranslation()
  const [statusButtonIndex, setStatusButtonIndex] = useState(0)
  const [pickMultiSelect, setPickMultiSelect] = useState<Array<ChainId>>(defaultValueChains)

  const onStatusButtonChange = (newIndex: number) => {
    setStatusButtonIndex(newIndex)
  }

  const { quests, loadMore, isFetching, hasNextPage } = useUserJoinedPublicQuests({
    chainIdList: pickMultiSelect,
    completionStatus: publicConvertIndexToStatus(statusButtonIndex),
  })

  const [sentryRef] = useInfiniteScroll({
    loading: isFetching,
    hasNextPage,
    onLoadMore: loadMore,
  })

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
      padding={['0 16px', '0 16px', '0 16px', '0 16px', '0 16px', '0 16px 80px 16px', '0 0 80px 0']}
    >
      <Flex width="100%" flexDirection={['column', 'column', 'row']}>
        <Flex flexDirection={['column', 'column', 'row']} mb={['16px', '16px', '24px']}>
          <ButtonMenu
            scale="sm"
            variant="subtle"
            m={['16px 0 0 0', '16px 0 0 0', '0']}
            activeIndex={statusButtonIndex}
            onItemClick={onStatusButtonChange}
          >
            <ButtonMenuItem>{t('Ongoing')}</ButtonMenuItem>
            <ButtonMenuItem>{t('Finished')}</ButtonMenuItem>
          </ButtonMenu>
        </Flex>
        <NetworkMultiSelector
          width={['100%', '100%', '320px']}
          maxWidth={['100%', '100%', '320px']}
          margin={['0 0 16px 0', '0 0 16px 0', '0 0 0 auto']}
          pickMultiSelect={pickMultiSelect}
          setPickMultiSelect={setPickMultiSelect}
        />
      </Flex>
      <>
        {!isFetching && quests?.length === 0 ? (
          <EmptyQuest
            title={t('There is nothing here, yet')}
            subTitle={t('Earn by contributing to the community')}
            showQuestLink
            // showCampaignLink
          />
        ) : (
          <>
            <StyledFlexGap>
              {quests?.map((quest) => (
                <Quest key={quest.id} quest={quest} customRedirectUrl={`/quests/${quest.id}?backToProfile=true`} />
              ))}
            </StyledFlexGap>
            <Box ref={hasNextPage ? sentryRef : undefined}>{isFetching && <SpinnerWithLoadingText />}</Box>
          </>
        )}
      </>
    </Box>
  )
}
