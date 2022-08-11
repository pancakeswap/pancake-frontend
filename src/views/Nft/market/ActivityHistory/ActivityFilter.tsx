import styled from 'styled-components'
import { Box, Button, Flex, IconButton, CloseIcon } from '@pancakeswap/uikit'
import { useAppDispatch } from 'state'
import { addActivityTypeFilters, removeActivityTypeFilters } from 'state/nftMarket/reducer'
import { useGetNftActivityFilters } from 'state/nftMarket/hooks'
import { ContextApi, useTranslation } from '@pancakeswap/localization'
import { MarketEvent } from '../../../../state/nftMarket/types'

interface ActivityFilterProps {
  eventType: MarketEvent
  collectionAddress: string
}

const TriggerButton = styled(Button)<{ hasItem: boolean }>`
  white-space: nowrap;
  ${({ hasItem }) =>
    hasItem &&
    `  
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
    padding-right: 8px;
  `}
`

const CloseButton = styled(IconButton)`
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
`

const eventName = (t: ContextApi['t'], eventType: string) => {
  switch (eventType) {
    case MarketEvent.CANCEL:
      return t('Delisted')
    case MarketEvent.MODIFY:
      return t('Modified')
    case MarketEvent.NEW:
      return t('Listed')
    case MarketEvent.SELL:
      return t('Sold')
    default:
      return ''
  }
}

export const ActivityFilter: React.FC<React.PropsWithChildren<ActivityFilterProps>> = ({
  eventType,
  collectionAddress,
}) => {
  const nftActivityFilters = useGetNftActivityFilters(collectionAddress)
  const dispatch = useAppDispatch()
  const { t } = useTranslation()

  const isEventSelected = nftActivityFilters.typeFilters.some((nftActivityFilter) => nftActivityFilter === eventType)

  const handleMenuClick = () => {
    if (!isEventSelected) {
      dispatch(addActivityTypeFilters({ collection: collectionAddress, field: eventType }))
    }
  }

  const handleClearItem = () => {
    dispatch(removeActivityTypeFilters({ collection: collectionAddress, field: eventType }))
  }

  return (
    <Flex alignItems="center" mr="4px" mb="4px">
      <Box>
        <TriggerButton
          onClick={handleMenuClick}
          variant={isEventSelected ? 'subtle' : 'light'}
          scale="sm"
          hasItem={isEventSelected}
        >
          {eventName(t, eventType)}
        </TriggerButton>
      </Box>
      {isEventSelected && (
        <CloseButton variant={isEventSelected ? 'subtle' : 'light'} scale="sm" onClick={handleClearItem}>
          <CloseIcon color="currentColor" width="18px" />
        </CloseButton>
      )}
    </Flex>
  )
}
