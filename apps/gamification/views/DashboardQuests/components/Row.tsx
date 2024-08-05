import { useTranslation } from '@pancakeswap/localization'
import { Box, EllipsisIcon, Flex, LogoRoundIcon, PencilIcon, Text, useMatchBreakpoints } from '@pancakeswap/uikit'
import { useRouter } from 'next/router'
import { MouseEvent, useRef, useState } from 'react'
import { styled } from 'styled-components'
import { Dropdown } from 'views/DashboardCampaigns/components/Dropdown'
import { StyledCell } from 'views/DashboardCampaigns/components/TableStyle'
import { StateType } from 'views/DashboardQuests/components/RecordTemplate'

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
  statusButtonIndex: StateType
}

export const Row: React.FC<RowProps> = ({ statusButtonIndex }) => {
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
            PancakeSwap Multichain Celebration - zkSync Era 123 123123 12312
          </Text>
        </Flex>
      </StyledCell>
      {isXxl && (
        <>
          <StyledCell role="cell">
            <Flex>
              <LogoRoundIcon width="20px" />
              <Text ml="8px">400 CAKE</Text>
            </Flex>
          </StyledCell>
          <StyledCell role="cell">
            <Text ml="auto">2400</Text>
          </StyledCell>
        </>
      )}
      {isDesktop && (
        <StyledCell role="cell">
          <Text ml="auto">12/12/2024 03:30 - 12/12/2024 03:30</Text>
        </StyledCell>
      )}
      <StyledCell role="cell" onClick={(e: MouseEvent) => openMoreButton(e)}>
        {statusButtonIndex !== StateType.FINISHED && (
          <Box position="relative" style={{ cursor: 'pointer' }}>
            <EllipsisIcon color="primary" width="12px" height="12px" />
            {isOpen && (
              <StyledDropdown setIsOpen={setIsOpen} dropdownRef={dropdownRef}>
                {/* <Flex onClick={(e: MouseEvent) => redirectUrl(e, '/campaigns')}>
                  <BarChartIcon color="primary" width="20px" height="20px" />
                  <Text ml="8px">{t('Statistics')}</Text>
                </Flex> */}

                {/* When has "Statistics" need hide "Edit" when statusButtonIndex !== StateType.FINISHED */}
                <Flex onClick={(e: MouseEvent) => redirectUrl(e, '/dashboard/quest/edit/123')}>
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
