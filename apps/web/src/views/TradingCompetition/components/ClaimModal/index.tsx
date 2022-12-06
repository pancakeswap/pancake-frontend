import { AutoRenewIcon, Button, Flex, Heading, Modal, Text, useToast } from '@pancakeswap/uikit'
import { ToastDescriptionWithTx } from 'components/Toast'
import { useTranslation } from '@pancakeswap/localization'
import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'
import useCatchTxError from 'hooks/useCatchTxError'
import { useTradingCompetitionContractMoD } from 'hooks/useContract'
import Image from 'next/legacy/image'
import styled from 'styled-components'
import { modPrizes } from '../../../../config/constants/trading-competition/prizes'
import { getRewardGroupAchievements, useModCompetitionRewards } from '../../helpers'
import MoDAllBunnies from '../../pngs/MoD-hero-bunnies.png'
import ModBunnyNft from '../../pngs/MoD-nft-prize.png'
import { CompetitionProps } from '../../types'
import { useCanClaimSpecialNFT } from '../../useCanClaimSpecialNFT'

const ImageWrapper = styled(Flex)`
  justify-content: center;
  width: 100%;
  height: fit-content;
  img {
    border-radius: ${({ theme }) => theme.radii.default};
  }
`

const ClaimModal: React.FC<React.PropsWithChildren<CompetitionProps>> = ({
  onDismiss,
  onClaimSuccess,
  userTradingInformation,
}) => {
  const tradingCompetitionContract = useTradingCompetitionContractMoD()
  const canClaimSpecialNFT = useCanClaimSpecialNFT()
  const { toastSuccess } = useToast()
  const { fetchWithCatchTxError, loading: isConfirming } = useCatchTxError()
  const { t } = useTranslation()

  const { userRewardGroup, userCakeRewards, userDarRewards, userPointReward, canClaimNFT } = userTradingInformation
  const { cakeReward, darReward } = useModCompetitionRewards({
    userCakeRewards,
    userDarRewards,
  })
  const achievement = getRewardGroupAchievements(modPrizes, userRewardGroup, userPointReward)
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
          {darReward.toFixed(4)} DAR
        </Heading>
        {/* NFT */}
        {canClaimSpecialNFT ? (
          <Flex alignItems="center" flexDirection="column" width="100%">
            <ImageWrapper>
              <Image src={ModBunnyNft} width={128} height={168} />
            </ImageWrapper>
            <Text mt="8px">{t('Bunny Helmet NFT')}</Text>
          </Flex>
        ) : null}
        {canClaimNFT ? (
          <Flex mt="8px" alignItems="center" flexDirection="column" width="100%">
            <ImageWrapper>
              <Image src={MoDAllBunnies} width={128} height={95} />
            </ImageWrapper>
            <Text mt="8px">{t('PancakeSwap NFT')}</Text>
            <Text color="textSubtle" mt="8px" fontSize="12px" textAlign="center">
              {t(
                'Your Mines of Dalarnia - Bunny Helmet NFT will be airdropped to your wallet before 00:00 UTC on 2nd June.',
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
