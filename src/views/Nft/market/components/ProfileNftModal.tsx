import React from 'react'
import { InjectedModalProps, Modal, Flex, Text, Button, useModal, Link, Grid } from '@pancakeswap/uikit'
import { BASE_URL } from 'config'
import useTheme from 'hooks/useTheme'
import styled from 'styled-components'
import { NftToken } from 'state/nftMarket/types'
import { useTranslation } from 'contexts/Localization'
import { RoundedImage } from './BuySellModals/shared/styles'
import EditProfileModal from '../Profile/components/EditProfileModal'

export const StyledModal = styled(Modal)`
  & > div:last-child {
    padding: 0;
  }
`

const TextWrapper = styled(Flex)`
  background-color: ${({ theme }) => theme.colors.dropdown};
`

interface ProfileNftModalProps extends InjectedModalProps {
  nft: NftToken
}

const ProfileNftModal: React.FC<ProfileNftModalProps> = ({ nft, onDismiss }) => {
  const [onEditProfileModal] = useModal(<EditProfileModal />, false)
  const { t } = useTranslation()
  const { theme } = useTheme()

  return (
    <StyledModal title={t('Details')} onDismiss={onDismiss} headerBackground={theme.colors.gradients.cardHeader}>
      <Flex flexDirection="column" maxWidth="350px">
        <Flex p="16px">
          <RoundedImage src={nft.image.thumbnail} height={68} width={68} mr="16px" />
          <Grid flex="1" gridTemplateColumns="1fr 1fr" alignItems="center">
            <Text bold>{nft.name}</Text>
            <Text fontSize="12px" color="textSubtle" textAlign="right">
              {nft.collectionName}
            </Text>
            {/* TODO: Add lowestPrice when available */}
          </Grid>
        </Flex>
        <TextWrapper p="24px 16px" flexDirection="column">
          <Text mb="16px">{t("You're using this NFT as your Pancake Profile picture")}</Text>
          <Text color="textSubtle" mb="16px" fontSize="14px">
            {t(
              'Removing it will suspend your profile, and you won’t be able to earn points, participate in team activities, or be eligible for new NFT drops.',
            )}
          </Text>
          <Text color="textSubtle" fontSize="14px">
            {t('Go to your profile page to continue.')}
          </Text>
        </TextWrapper>
        <Flex flexDirection="column" pt="4px" pb="16px" px="16px" alignItems="center">
          <Button as={Link} variant="text" mb="8px" href={`${BASE_URL}/nft/market/item/${nft.name}`}>
            {t('View Item Page')}
          </Button>
          <Button onClick={onEditProfileModal} variant="secondary">
            {t('Remove Profile Pic')}
          </Button>
        </Flex>
      </Flex>
    </StyledModal>
  )
}

export default ProfileNftModal
