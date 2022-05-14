import styled from 'styled-components'
import { Modal, Button, Flex, AutoRenewIcon, Heading, Text } from '@pancakeswap/uikit'
import Image from 'next/image'
import { useTranslation } from 'contexts/Localization'
import { useTradingCompetitionContractMoD } from 'hooks/useContract'
import useToast from 'hooks/useToast'
import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'
import useCatchTxError from 'hooks/useCatchTxError'
import { ToastDescriptionWithTx } from 'components/Toast'
import { useCompetitionRewards, getRewardGroupAchievements } from '../../helpers'
import { CompetitionProps } from '../../types'
import MoboxBunnyNft from '../../pngs/mobox-bunny-nft.png'
import MoboxAllBunnies from '../../pngs/mobox-all-bunnies.png'
import MoboxMysteryBox from '../../pngs/mobox-mystery-box.png'
import { mboxPrizes } from '../../../../config/constants/trading-competition/prizes'

const ImageWrapper = styled(Flex)`
  justify-content: center;
  width: 100%;
  height: fit-content;
  img {
    border-radius: ${({ theme }) => theme.radii.default};
  }
`

const ClaimModal: React.FC<CompetitionProps> = ({ onDismiss, onClaimSuccess, userTradingInformation }) => {
  const tradingCompetitionContract = useTradingCompetitionContractMoD()
  const { toastSuccess } = useToast()
  const { fetchWithCatchTxError, loading: isConfirming } = useCatchTxError()
  const { t } = useTranslation()

  const { userRewardGroup, userCakeRewards, userMoboxRewards, userPointReward, canClaimMysteryBox, canClaimNFT } =
    userTradingInformation
  const { cakeReward, moboxReward } = useCompetitionRewards({
    userCakeRewards,
    userMoboxRewards,
  })
  const achievement = getRewardGroupAchievements(mboxPrizes, userRewardGroup, userPointReward)
  const { callWithGasPrice } = useCallWithGasPrice()

  const handleClaimClick = async () => {
    const receipt = await fetchWithCatchTxError(() => {
      return callWithGasPrice(tradingCompetitionContract, 'claimReward')
    })
    if (receipt?.status) {
      toastSuccess(t('You have claimed your rewards!'), <ToastDescriptionWithTx txHash={receipt.transactionHash} />)
      onDismiss()
      onClaimSuccess()
    }
  }

  return (
    <Modal title={t('Collect Winnings')} onDismiss={onDismiss}>
      <Flex width="100%" flexDirection="column" alignItems="center" justifyContent="center" maxWidth="360px">
        <Text color="secondary" bold>
          {t('Congratulations! You won')}:
        </Text>
        <Flex mt="16px" alignItems="center">
          {/* achievements */}
          <Image src={`/images/achievements/${achievement.image}`} width={25} height={25} />
          <Text ml={['4px', '8px']}>
            +{userPointReward} {t('Points')}
          </Text>
        </Flex>
        {/* tokens */}
        <Heading mt="16px" scale="md" mb={canClaimNFT ? '16px' : '0px'}>
          {cakeReward.toFixed(4)} CAKE
        </Heading>
        <Heading mt="16px" scale="md" mb={canClaimNFT ? '16px' : '0px'}>
          {moboxReward.toFixed(4)} MBOX
        </Heading>
        {/* NFT */}
        {canClaimNFT ? (
          <Flex alignItems="center" flexDirection="column" width="100%">
            <ImageWrapper>
              <Image src={MoboxBunnyNft} width={128} height={128} />
            </ImageWrapper>
            <Text mt="8px">{t('Collectible NFT')}</Text>
          </Flex>
        ) : null}
        {canClaimMysteryBox ? (
          <Flex mt="8px" alignItems="center" flexDirection="column" width="100%">
            <ImageWrapper>
              <Image src={MoboxMysteryBox} width={78} height={56} />
            </ImageWrapper>
            <Text mt="8px">{t('Mystery Box')}</Text>
          </Flex>
        ) : null}
        {canClaimNFT ? (
          <Flex mt="8px" alignItems="center" flexDirection="column" width="100%">
            <ImageWrapper>
              <Image src={MoboxAllBunnies} width={128} height={95} />
            </ImageWrapper>
            <Text mt="8px">{t('Mobox Avatar NFT')}</Text>
            <Text color="textSubtle" mt="8px" fontSize="12px" textAlign="center">
              {t(
                'Your Mobox Avatars NFT prizes will be airdropped to your wallet address before 00:00 UTC 25th April.',
              )}
            </Text>
          </Flex>
        ) : null}
        <Button
          mt="24px"
          width="100%"
          onClick={handleClaimClick}
          disabled={isConfirming}
          isLoading={isConfirming}
          endIcon={isConfirming ? <AutoRenewIcon spin color="currentColor" /> : null}
        >
          {t('Confirm')}
        </Button>
        <Text mt="24px" fontSize="12px" color="textSubtle" textAlign="center">
          {t('All prizes will be sent directly to your wallet and user account.')}
        </Text>
      </Flex>
    </Modal>
  )
}

export default ClaimModal
