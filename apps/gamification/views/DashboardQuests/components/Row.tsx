import { useTranslation } from '@pancakeswap/localization'
import { ChainId, Currency } from '@pancakeswap/sdk'
import { CAKE, getTokensByChain } from '@pancakeswap/tokens'
import { Box, EllipsisIcon, Flex, PencilIcon, Text, useMatchBreakpoints } from '@pancakeswap/uikit'
import { TokenWithChain } from 'components/TokenWithChain'
import { useRouter } from 'next/router'
import { MouseEvent, useMemo, useRef, useState } from 'react'
import { styled } from 'styled-components'
import { Dropdown } from 'views/DashboardCampaigns/components/Dropdown'
import { StyledCell } from 'views/DashboardCampaigns/components/TableStyle'
import { SingleQuestData } from 'views/DashboardQuestEdit/hooks/useGetSingleQuestData'
import { CompletionStatusIndex } from 'views/DashboardQuestEdit/type'
import { convertTimestampToDate } from 'views/DashboardQuestEdit/utils/combineDateAndTime'

const StyledRow = styled.div`
  background-color: transparent;
  display: flex;

  ${StyledCell} {
    &:first-child {
      flex: 40%;
      padding-left: 24px;
    }

    &:nth-child(2) {
      flex: 20%;
    }

    &:nth-child(3) {
      flex: 10%;
    }

    &:nth-child(4) {
      flex: 30%;
    }

    &:last-child {
      flex: 0 0 36px;
      padding-right: 24px;
    }
  }
`

const StyledDropdown = styled(Dropdown)`
  width: 200px;
  left: -180px;
  bottom: 24px;
`

interface RowProps {
  quest: SingleQuestData
  statusButtonIndex: CompletionStatusIndex
}

export const Row: React.FC<RowProps> = ({ quest, statusButtonIndex }) => {
  const { t } = useTranslation()
  const router = useRouter()
  const dropdownRef = useRef<HTMLDivElement>(null)
  const { isXxl, isDesktop } = useMatchBreakpoints()
  const [isOpen, setIsOpen] = useState(false)

  const openMoreButton = (e: MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsOpen(!isOpen)
  }

  const redirectUrl = (e: MouseEvent, sourceUrl: string) => {
    e.preventDefault()
    e.stopPropagation()
    router.push(sourceUrl)
  }

  const currency = useMemo((): Currency => {
    const reward = quest?.reward
    const list = getTokensByChain(reward?.currency?.network)
    const findToken = list.find((i) => i.address.toLowerCase() === reward?.currency?.address?.toLowerCase())
    return findToken || (CAKE as any)?.[ChainId.BSC]
  }, [quest])

  return (
    <StyledRow role="row">
      <StyledCell role="cell">
        <Flex>
          <Text
            bold
            overflow="hidden"
            display="-webkit-box"
            style={{
              whiteSpace: 'initial',
              WebkitLineClamp: 1,
              WebkitBoxOrient: 'vertical',
            }}
          >
            {quest.title ?? '-'}
          </Text>
        </Flex>
      </StyledCell>
      {isXxl && (
        <>
          <StyledCell role="cell">
            <Flex>
              {quest.reward ? (
                <>
                  <TokenWithChain currency={currency} width={20} height={20} />
                  <Text ml="8px">{`${quest.reward.totalRewardAmount} ${currency.symbol}`}</Text>
                </>
              ) : (
                <Text ml="8px">-</Text>
              )}
            </Flex>
          </StyledCell>
          <StyledCell role="cell">
            <Text ml="auto">{quest?.numberOfParticipants ?? 0}</Text>
          </StyledCell>
        </>
      )}
      {isDesktop && (
        <StyledCell role="cell">
          {quest.startDateTime && quest.endDateTime ? (
            <Text ml="auto">{`${convertTimestampToDate(quest.startDateTime)} - ${convertTimestampToDate(
              quest.endDateTime,
            )}`}</Text>
          ) : (
            <Text ml="auto">-</Text>
          )}
        </StyledCell>
      )}
      <StyledCell role="cell" onClick={(e: MouseEvent) => openMoreButton(e)}>
        {statusButtonIndex !== CompletionStatusIndex.FINISHED && (
          <Box position="relative" style={{ cursor: 'pointer' }}>
            <EllipsisIcon color="primary" width="12px" height="12px" />
            {isOpen && (
              <StyledDropdown setIsOpen={setIsOpen} dropdownRef={dropdownRef}>
                {/* <Flex onClick={(e: MouseEvent) => redirectUrl(e, '/dashboard/quest/statistics')}>
                  <BarChartIcon color="primary" width="20px" height="20px" />
                  <Text ml="8px">{t('Statistics')}</Text>
                </Flex> */}

                {/* When has "Statistics" need hide "Edit" when statusButtonIndex !== CompletionStatusIndex.FINISHED */}
                <Flex onClick={(e: MouseEvent) => redirectUrl(e, `/dashboard/quest/edit/${quest.id}`)}>
                  <PencilIcon color="primary" width="14px" height="14px" />
                  <Text ml="14px">{t('Edit')}</Text>
                </Flex>
              </StyledDropdown>
            )}
          </Box>
        )}
      </StyledCell>
    </StyledRow>
  )
}
