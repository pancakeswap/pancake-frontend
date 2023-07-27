import styled from 'styled-components'
import { useTranslation } from '@pancakeswap/localization'
import { AtomBox } from '@pancakeswap/ui'
import {
  ModalContainer,
  ModalCloseButton,
  Text,
  RowBetween,
  ModalBody,
  Flex,
  ModalActions,
  AutoColumn,
  Pool,
} from '@pancakeswap/uikit'
import { useAccount } from 'wagmi'
import LockedBenefits from 'views/Pools/components/RevenueSharing/BenefitsModal/LockedBenefits'
import RevenueSharing from 'views/Pools/components/RevenueSharing/BenefitsModal/RevenueSharing'
import SharingPoolNameCell from 'views/Pools/components/RevenueSharing/BenefitsModal/SharingPoolNameCell'
import { Token } from '@pancakeswap/sdk'
import LockedActions from 'views/Pools/components/LockedPool/Common/LockedActions'
import { DeserializedLockedVaultUser } from 'state/types'

const Container = styled(ModalContainer)`
  width: 100%;
  overflow: hidden;
  max-height: 90vh;

  ${({ theme }) => theme.mediaQueries.md} {
    width: 375px;
  }
`

const ScrollableContainer = styled(Flex)`
  flex-direction: column;
  height: auto;
  ${({ theme }) => theme.mediaQueries.xs} {
    max-height: 100vh;
  }
  ${({ theme }) => theme.mediaQueries.md} {
    max-height: none;
  }
`

interface BenefitsModalProps {
  pool: Pool.DeserializedPool<Token>
  userData: DeserializedLockedVaultUser
  onDismiss?: () => void
}

const BenefitsModal: React.FunctionComponent<React.PropsWithChildren<BenefitsModalProps>> = ({
  pool,
  userData,
  onDismiss,
}) => {
  const { t } = useTranslation()

  useAccount({
    onConnect: ({ connector }) => {
      connector?.addListener('change', () => onDismiss?.())
    },
    onDisconnect: () => onDismiss?.(),
  })

  return (
    <Container>
      <AtomBox bg="gradientBubblegum" py="24px">
        <RowBetween flexWrap="nowrap" px="24px">
          <Text fontSize={20} bold>
            {t('Locked CAKE Benefits')}
          </Text>
          <ModalCloseButton onDismiss={onDismiss} />
        </RowBetween>
        <ModalBody mt="16px" width="100%" style={{ maxHeight: 'calc(100vh - 260px)' }}>
          <ScrollableContainer px="24px">
            <SharingPoolNameCell />
            <LockedBenefits />
            <RevenueSharing onDismiss={onDismiss} />
          </ScrollableContainer>
        </ModalBody>
        <AutoColumn px="24px" gap="16px">
          <ModalActions>
            <LockedActions
              userShares={userData?.userShares}
              locked={userData?.locked}
              lockEndTime={userData?.lockEndTime}
              lockStartTime={userData?.lockStartTime}
              stakingToken={pool?.stakingToken}
              stakingTokenPrice={pool?.stakingTokenPrice}
              stakingTokenBalance={pool?.userData?.stakingTokenBalance}
              lockedAmount={userData?.balance?.cakeAsBigNumber}
            />
          </ModalActions>
        </AutoColumn>
      </AtomBox>
    </Container>
  )
}

export default BenefitsModal
