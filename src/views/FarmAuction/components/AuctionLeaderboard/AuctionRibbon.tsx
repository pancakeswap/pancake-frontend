import { Text } from '@pancakeswap/uikit'
import { Auction, AuctionStatus } from 'config/constants/types'
import { useTranslation } from '@pancakeswap/localization'

import styled from 'styled-components'

const StyledRibbon = styled.div<{ color: string }>`
  display: flex;
  justify-content: center;
  background-color: ${({ theme, color }) => theme.colors[color]};
  color: white;
  position: absolute;
  right: 0;
  top: 0;
  text-align: center;
  width: 94px;
  height: 94px;
  z-index: 1;
  clip-path: polygon(0 0, 40% 0, 100% 60%, 100% 100%);

  & > div {
    padding-top: 23%;
    overflow: hidden;
    transform: rotate(45deg);
  }
`

const AuctionRibbon: React.FC<{ auction: Auction; noAuctionHistory: boolean }> = ({ auction, noAuctionHistory }) => {
  const { t } = useTranslation()
  const { status } = auction

  // Don't show Live or Finished in case of fresh contract with no history
  if (noAuctionHistory) {
    return null
  }

  let ribbonText = t('Finished')
  let color = 'textDisabled'
  if (status === AuctionStatus.Open) {
    ribbonText = `${t('Live')}!`
    color = 'success'
  }
  if (status === AuctionStatus.Pending) {
    ribbonText = `${t('Get ready')}!`
    color = 'warning'
  }
  return (
    <StyledRibbon color={color}>
      <Text color="white" textTransform="uppercase">
        {ribbonText}
      </Text>
    </StyledRibbon>
  )
}

export default AuctionRibbon
