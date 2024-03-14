import { useTranslation } from '@pancakeswap/localization'
import {
  Button,
  Flex,
  Grid,
  InjectedModalProps,
  LinkExternal,
  Modal,
  ScanLink,
  Text,
  useModal,
} from '@pancakeswap/uikit'
import useTheme from 'hooks/useTheme'
import { NftToken } from 'state/nftMarket/types'
import { styled } from 'styled-components'
import { getBscScanLinkForNft, safeGetAddress } from 'utils'
import EditProfileModal from '../../../Profile/components/EditProfileModal'
import { nftsBaseUrl, pancakeBunniesAddress } from '../constants'
import { HorizontalDivider, RoundedImage } from './BuySellModals/shared/styles'

export const StyledModal = styled(Modal)`
  & > div:last-child {
    padding: 0;
  }
`

const TextWrapper = styled(Flex)`
  background-color: ${({ theme }) => theme.colors.dropdown};
`

interface ProfileNftModalProps extends InjectedModalProps {
  nft?: NftToken
  onSuccess?: () => void
}

const ProfileNftModal: React.FC<React.PropsWithChildren<ProfileNftModalProps>> = ({ nft, onDismiss, onSuccess }) => {
  const [onEditProfileModal] = useModal(<EditProfileModal onSuccess={onSuccess} />, false)
  const { t } = useTranslation()
  const { theme } = useTheme()

  const itemPageUrlId =
    safeGetAddress(nft?.collectionAddress) === safeGetAddress(pancakeBunniesAddress)
      ? nft?.attributes?.[0].value
      : nft?.tokenId

  return (
    <StyledModal title={t('Details')} onDismiss={onDismiss} headerBackground={theme.colors.gradientCardHeader}>
      <Flex flexDirection="column" maxWidth="420px">
        <Flex p="16px">
          <RoundedImage src={nft?.image.thumbnail} height={68} width={68} mr="16px" />
          <Grid flex="1" gridTemplateColumns="1fr 1fr" alignItems="center">
            <Text bold>{nft?.name}</Text>
            <Text fontSize="12px" color="textSubtle" textAlign="right">
              {nft?.collectionName}
            </Text>
            {/* TODO: Add lowestPrice when available */}
          </Grid>
        </Flex>
        <Flex justifyContent="space-between" px="16px" mb="16px">
          <Flex flex="2">
            <Text small color="textSubtle">
              {t('Token ID: %id%', { id: nft?.tokenId })}
            </Text>
          </Flex>
          <Flex justifyContent="space-between" flex="3">
            <LinkExternal
              p="0px"
              height="16px"
              href={`${nftsBaseUrl}/collections/${nft?.collectionAddress}/${itemPageUrlId}`}
            >
              {t('View Item')}
            </LinkExternal>
            <HorizontalDivider />
            <ScanLink p="0px" height="16px" href={getBscScanLinkForNft(nft?.collectionAddress, nft?.tokenId)}>
              BscScan
            </ScanLink>
          </Flex>
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
        <Flex flexDirection="column" py="16px" px="16px">
          <Button onClick={onEditProfileModal} width="100%" variant="secondary">
            {t('Remove Profile Pic')}
          </Button>
        </Flex>
      </Flex>
    </StyledModal>
  )
}

export default ProfileNftModal
