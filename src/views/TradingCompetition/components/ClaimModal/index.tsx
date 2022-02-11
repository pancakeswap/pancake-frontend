import React from 'react'
import styled from 'styled-components'
import { Modal, Button, Flex, AutoRenewIcon, Heading, Text } from '@tovaswapui/uikit'
import Image from 'next/image'
import { useTranslation } from 'contexts/Localization'
import { useTradingCompetitionContractV2 } from 'hooks/useContract'
import useToast from 'hooks/useToast'
import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'
import useCatchTxError from 'hooks/useCatchTxError'
import { ToastDescriptionWithTx } from 'components/Toast'
import { useCompetitionRewards, getRewardGroupAchievements } from '../../helpers'
import { CompetitionProps } from '../../types'
import NftBunnies from '../../pngs/fan-token-champions.png'

const ImageWrapper = styled(Flex)`
  justify-content: center;
  width: 100%;
  height: fit-content;
  img {
    border-radius: ${({ theme }) => theme.radii.default};
  }
`

const ClaimModal: React.FC<CompetitionProps> = ({ onDismiss, onClaimSuccess, userTradingInformation }) => {
  const tradingCompetitionContract = useTradingCompetitionContractV2()
  const { toastSuccess } = useToast()
  const { fetchWithCatchTxError, loading: isConfirming } = useCatchTxError()
  const { t } = useTranslation()

  const {
    userRewardGroup,
    userCakeRewards,
    userLazioRewards,
    userPortoRewards,
    userSantosRewards,
    userPointReward,
    canClaimNFT,
  } = userTradingInformation
  const { cakeReward, lazioReward, portoReward, santosReward } = useCompetitionRewards({
    userCakeRewards,
    userLazioRewards,
    userPortoRewards,
    userSantosRewards,
  })
  const achievement = getRewardGroupAchievements(userRewardGroup, userPointReward)
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
        <Text color="secondary" bold fontSize="16px">
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
          {cakeReward.toFixed(2)} CAKE
        </Heading>
        <Heading mt="16px" scale="md" mb={canClaimNFT ? '16px' : '0px'}>
          {lazioReward.toFixed(2)} LAZIO
        </Heading>
        <Heading mt="16px" scale="md" mb={canClaimNFT ? '16px' : '0px'}>
          {portoReward.toFixed(2)} PORTO
        </Heading>
        <Heading mt="16px" scale="md" mb={canClaimNFT ? '16px' : '0px'}>
          {santosReward.toFixed(2)} SANTOS
        </Heading>
        {/* NFT */}
        {canClaimNFT ? (
          <Flex alignItems="center" flexDirection="column" width="100%">
            <ImageWrapper>
              <Image src={NftBunnies} width={128} height={128} />
            </ImageWrapper>
            <Text mt="8px" fontSize="16px">
              {t('Collectible NFT')}
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
