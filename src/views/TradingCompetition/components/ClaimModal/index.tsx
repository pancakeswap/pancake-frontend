import React, { useState } from 'react'
import { useWeb3React } from '@web3-react/core'
import styled from 'styled-components'
import {
  Modal,
  Button,
  Flex,
  AutoRenewIcon,
  Heading,
  Text,
  Image,
  CrownIcon,
  TrophyGoldIcon,
  TeamPlayerIcon,
} from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import { useTradingCompetitionContract } from 'hooks/useContract'
import useToast from 'hooks/useToast'
import { useCompetitionCakeRewards, getRewardGroupAchievements } from '../../helpers'
import { CompetitionProps } from '../../types'
import NftBunnies from '../../pngs/syrup-nft.png'

const ImageWrapper = styled(Flex)`
  justify-content: center;
  width: 100%;
  height: fit-content;
  img {
    border-radius: ${({ theme }) => theme.radii.default};
  }
`

const ClaimModal: React.FC<CompetitionProps> = ({ onDismiss, onClaimSuccess, userTradingInformation }) => {
  const [isConfirming, setIsConfirming] = useState(false)
  const tradingCompetitionContract = useTradingCompetitionContract()
  const { account } = useWeb3React()
  const { toastSuccess, toastError } = useToast()
  const { t } = useTranslation()

  const { userRewardGroup, userCakeRewards, userPointReward, canClaimNFT } = userTradingInformation
  const { cakeReward } = useCompetitionCakeRewards(userCakeRewards)
  const { champion, teamPlayer } = getRewardGroupAchievements(userRewardGroup)

  const handleClaimClick = () => {
    tradingCompetitionContract.methods
      .claimReward()
      .send({ from: account })
      .on('sending', () => {
        setIsConfirming(true)
      })
      .on('receipt', async () => {
        toastSuccess('You have claimed your rewards!')
        onDismiss()
        onClaimSuccess()
      })
      .on('error', (error) => {
        toastError(t('Error'), error?.message)
        setIsConfirming(false)
      })
  }

  return (
    <Modal title={t('Collect Winnings')} onDismiss={onDismiss}>
      <Flex width="100%" flexDirection="column" alignItems="center" justifyContent="center" maxWidth="360px">
        <Text color="secondary" bold fontSize="16px">
          {t('Congratulations! You won')}:
        </Text>
        <Flex mt="16px" alignItems="center">
          {/* achievements */}
          <TrophyGoldIcon mr={[0, '4px']} />
          {champion && <CrownIcon mr={[0, '4px']} />}
          {teamPlayer && <TeamPlayerIcon mr={[0, '4px']} />}
          <Text ml={['4px', '8px']}>
            +{userPointReward} {t('Points')}
          </Text>
        </Flex>
        {/* cake */}
        <Heading mt="16px" scale="md" mb={canClaimNFT ? '16px' : '0px'}>
          {cakeReward.toFixed(2)} CAKE
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
