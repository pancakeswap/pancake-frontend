import { Card } from '@pancakeswap/uikit'
import { styled } from 'styled-components'
import CardBody from './CardBody'
import { CollectibleCardProps } from './types'

const StyledCollectibleCard = styled(Card)`
  border-radius: 8px;
  max-width: 320px;
  transition: opacity 200ms;

  & > div {
    border-radius: 8px;
  }

  ${({ theme }) => theme.mediaQueries.lg} {
    &:hover {
      cursor: pointer;
      opacity: 0.6;
    }
  }
`

export const CollectibleActionCard: React.FC<React.PropsWithChildren<CollectibleCardProps>> = ({
  nft,
  nftLocation,
  currentAskPrice,
  isUserNft,
  ...props
}) => {
  return (
    <StyledCollectibleCard {...props}>
      <CardBody nft={nft} nftLocation={nftLocation} currentAskPrice={currentAskPrice} isUserNft={isUserNft} />
    </StyledCollectibleCard>
  )
}
