import { ChainId } from '@pancakeswap/chains'
import { useTranslation } from '@pancakeswap/localization'
import { Box, ButtonMenu, ButtonMenuItem, Flex, FlexGap } from '@pancakeswap/uikit'
import { NetworkMultiSelector, defaultValueChains } from 'components/NetworkMultiSelector'
import { SpinnerWithLoadingText } from 'components/SpinnerWithLoadingText'
import { useCallback, useState } from 'react'
import useInfiniteScroll from 'react-infinite-scroll-hook'
import { styled } from 'styled-components'
import { EmptyQuest } from 'views/Quests/components/EmptyQuest'
import { Quest } from 'views/Quests/components/Quest'
import { usePublicQuests } from 'views/Quests/hooks/usePublicQuests'
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

export const Quests = () => {
  const { t } = useTranslation()
  const [statusButtonIndex, setStatusButtonIndex] = useState(0)
  const [pickMultiSelect, setPickMultiSelect] = useState<Array<ChainId>>(defaultValueChains)

  const onStatusButtonChange = useCallback((newIndex: number) => {
    setStatusButtonIndex(newIndex)
  }, [])

  const { quests, loadMore, isFetching, hasNextPage } = usePublicQuests({
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
      padding={['0 16px', '0 16px', '0 16px', '0 16px', '0 16px', '0 16px', '0']}
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
            subTitle={t('Follow our social media to keep up to date with our next quests!')}
          />
        ) : (
          <>
            <StyledFlexGap>
              {quests?.map((quest) => (
                <Quest key={quest.id} quest={quest} />
              ))}
            </StyledFlexGap>
            <Box ref={hasNextPage ? sentryRef : undefined}>{isFetching && <SpinnerWithLoadingText />}</Box>
          </>
        )}
      </>
    </Box>
  )
}
