import styled from 'styled-components'
import { Flex, TrophyGoldIcon } from '@pancakeswap/uikit'
import { useGetIsClaimable } from 'state/predictions/hooks'
import { useTranslation } from '@pancakeswap/localization'
import CollectWinningsButton from '../CollectWinningsButton'

interface CollectWinningsOverlayProps {
  epoch: number
  isBottom?: boolean
}

const Wrapper = styled(Flex)<{ isBottom: CollectWinningsOverlayProps['isBottom'] }>`
  background-color: ${({ theme }) => theme.colors.secondary};
  left: 0;
  position: absolute;
  width: 100%;
  z-index: 30;

  ${({ isBottom }) => {
    return isBottom
      ? `
      border-radius: 0 0 16px 16px;
      bottom: 0;
    `
      : `
      top: 37px; // Card header height
    `
  }}
`

const CollectWinningsOverlay: React.FC<React.PropsWithChildren<CollectWinningsOverlayProps>> = ({
  epoch,
  isBottom = false,
  ...props
}) => {
  const { t } = useTranslation()
  const isClaimable = useGetIsClaimable(epoch)

  if (!isClaimable) {
    return null
  }

  return (
    <Wrapper alignItems="center" p="16px" isBottom={isBottom} {...props}>
      <TrophyGoldIcon width="64px" style={{ flex: 'none' }} mr="8px" />
      <CollectWinningsButton hasClaimed={false} width="100%">
        {t('Collect Winnings')}
      </CollectWinningsButton>
    </Wrapper>
  )
}

export default CollectWinningsOverlay
