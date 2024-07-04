import { useTranslation } from '@pancakeswap/localization'
import { zksyncTokens } from '@pancakeswap/tokens'
import {
  AtomBox,
  Box,
  Button,
  Flex,
  Heading,
  Link,
  ModalBody,
  ModalCloseButton,
  ModalContainer,
  ModalHeader,
  ModalTitle,
  ModalV2,
  Text,
  useMatchBreakpoints,
} from '@pancakeswap/uikit'
import { formatNumber, getBalanceNumber } from '@pancakeswap/utils/formatBalance'
import BN from 'bignumber.js'
import ConnectWalletButton from 'components/ConnectWalletButton'
import { ASSET_CDN } from 'config/constants/endpoints'
import { styled } from 'styled-components'
import { useAccount } from 'wagmi'
import { useClaimZksyncAirdrop, useUserWhiteListData } from './hooks'

const StyledModalHeader = styled(ModalHeader)`
  padding: 0;
  margin-bottom: 16px;
`
const asset = `${ASSET_CDN}/web/banners/zksync-airdrop-banner/modal.png`

export const ClaimZksyncAirdropModal: React.FC<{
  onDismiss?: () => void
  isOpen?: boolean
}> = ({ onDismiss, isOpen }) => {
  const { isDesktop } = useMatchBreakpoints()
  const { t } = useTranslation()
  const whiteListData = useUserWhiteListData()
  const { claimAirDrop, pendingTx } = useClaimZksyncAirdrop()
  const { address: account } = useAccount()
  return (
    <ModalV2
      isOpen={isOpen}
      onDismiss={() => {
        onDismiss?.()
      }}
      closeOnOverlayClick
    >
      <ModalContainer style={{ minWidth: '360px', padding: isDesktop ? '24px' : '24px 24px 0 24px' }}>
        <AtomBox justifyContent="space-between" p="24px" maxWidth="420px" height="100%" style={{ margin: '-24px' }}>
          <StyledModalHeader headerBorderColor="transparent">
            <ModalTitle>
              <Flex flexDirection="column">
                <Heading scale="md">{t('AirDrop Claiming')}</Heading>
              </Flex>
            </ModalTitle>
            <ModalCloseButton onDismiss={onDismiss} />
          </StyledModalHeader>
          <ModalBody minHeight={350}>
            <Box
              width="100%"
              height="200px"
              mb="24px"
              style={{ backgroundImage: `url(${asset})`, backgroundSize: 'cover' }}
            />
            <Text>
              {t('%amount% %token% available to claim!', {
                amount: formatNumber(getBalanceNumber(new BN(whiteListData?.amount?.toString() ?? 0))),
                token: zksyncTokens.zk.symbol,
              })}
            </Text>
            <Text mt="16px" mb="8px">
              {t('Congratulations! You are eligible to claim from the zkSync token airdrop campaign!')}
            </Text>
            <Link href="/">{t('Learn more about the campaign')}</Link>
            {account ? (
              <Button mt="24px" isLoading={pendingTx} onClick={claimAirDrop}>
                {t('Claim now')}
              </Button>
            ) : (
              <ConnectWalletButton mt="24px" />
            )}
          </ModalBody>
        </AtomBox>
      </ModalContainer>
    </ModalV2>
  )
}
