import { useRef, useState, useEffect } from 'react'
import { Modal, Flex, Button, Text, Skeleton, Box } from '@pancakeswap/uikit'
import styled from 'styled-components'
import { useTranslation } from 'contexts/Localization'
import FlippersShare from '../pngs/flippers-share.png'
import StormShare from '../pngs/storm-share.png'
import CakersShare from '../pngs/cakers-share.png'
import ProfileMask from '../pngs/share-profile-mask.png'
import MedalGold from '../pngs/medals/medal-gold.png'
import MedalSilver from '../pngs/medals/medal-silver.png'
import MedalBronze from '../pngs/medals/medal-bronze.png'
import MedalPurple from '../pngs/medals/medal-purple.png'
import MedalTeal from '../pngs/medals/medal-teal.png'

import { localiseTradingVolume } from '../helpers'
import { YourScoreProps } from '../types'

const StyledCanvas = styled.canvas`
  width: 100%;
`

const StyledButton = styled(Button)`
  display: none;
  ${({ theme }) => theme.mediaQueries.sm} {
    display: block;
  }
`

const MobileText = styled(Text)`
  display: block;
  ${({ theme }) => theme.mediaQueries.sm} {
    display: none;
  }
`

const ShareImageModal: React.FC<YourScoreProps> = ({ onDismiss, profile, userLeaderboardInformation }) => {
  const { t } = useTranslation()
  const { global, team, volume } = userLeaderboardInformation
  const [bgImage, setBgImage] = useState(null)
  const [profileImage, setProfileImage] = useState(null)
  const [profileOverlayImage, setProfileOverlayImage] = useState(null)
  const [medalImage, setMedalImage] = useState(null)

  const [imageFromCanvas, setImageFromCanvas] = useState(null)
  const canvas = useRef(null)

  const getMedal = (rank: React.ReactText) => {
    if (rank === 1) {
      return MedalGold
    }
    if (rank <= 10) {
      return MedalSilver
    }
    if (rank <= 100) {
      return MedalBronze
    }
    if (rank <= 500) {
      return MedalPurple
    }
    return MedalTeal
  }

  useEffect(() => {
    const bgImages = [StormShare.src, FlippersShare.src, CakersShare.src]
    const bgImagEl = new Image()
    bgImagEl.src = bgImages[profile.teamId - 1]
    bgImagEl.onload = () => setBgImage(bgImagEl)

    const profileImageEl = new Image()
    profileImageEl.src = `${profile.nft?.image?.thumbnail}?d=${new Date().getTime()}`
    profileImageEl.crossOrigin = 'Anonymous'
    profileImageEl.onload = () => setProfileImage(profileImageEl)

    const profileImageOverlayEl = new Image()
    profileImageOverlayEl.src = ProfileMask.src
    profileImageOverlayEl.onload = () => setProfileOverlayImage(profileImageOverlayEl)

    const medalImageEl = new Image()
    medalImageEl.src = getMedal(team).src
    medalImageEl.onload = () => setMedalImage(medalImageEl)
  }, [profile, team])

  useEffect(() => {
    const canvasEl = canvas.current
    if (canvasEl && bgImage && profileImage && profileOverlayImage && medalImage) {
      const canvasWidth = canvasEl.width
      canvasEl.height = canvasWidth * 0.5625
      const canvasHeight = canvasEl.height

      const ctx = canvasEl.getContext('2d')

      ctx.drawImage(bgImage, 0, 0, canvasWidth, canvasHeight)
      ctx.drawImage(profileImage, canvasWidth * 0.0315, canvasHeight * 0.07, canvasWidth * 0.19, canvasWidth * 0.19)
      ctx.drawImage(profileOverlayImage, 0, 0, canvasWidth * 0.235, canvasWidth * 0.235)
      ctx.drawImage(medalImage, canvasWidth * 0.15, canvasHeight * 0.32, canvasWidth * 0.06, canvasWidth * 0.06)

      ctx.font = 'bold 84px Kanit'
      ctx.fillStyle = 'white'
      ctx.fillText(`@${profile.username}`, canvasWidth * 0.033, canvasHeight * 0.53)

      ctx.font = 'bold 72px Kanit'
      ctx.fillText(`# ${team.toLocaleString()}`, canvasWidth * 0.18, canvasHeight * 0.69)
      ctx.fillText(`# ${global.toLocaleString()}`, canvasWidth * 0.18, canvasHeight * 0.79)
      ctx.fillText(`$ ${localiseTradingVolume(volume)}`, canvasWidth * 0.18, canvasHeight * 0.89)

      setImageFromCanvas(canvasEl.toDataURL('image/png'))
    }
  }, [bgImage, profileImage, team, global, volume, profile, profileOverlayImage, medalImage])

  const downloadImage = () => {
    const link = document.createElement('a')
    link.download = `battle-${profile.username}.png`
    link.href = imageFromCanvas
    link.click()
  }

  return (
    <Modal title={t('Share Your Score')} onDismiss={onDismiss} minWidth="280px">
      <Flex flexDirection="column" alignItems="center" maxWidth="460px">
        {bgImage && profileImage ? (
          <Flex alignItems="center" justifyContent="center" minHeight="258px">
            <Box height="0px">
              <StyledCanvas ref={canvas} width="1600px" />
            </Box>
            {imageFromCanvas && <img alt="your shareable score" src={`${imageFromCanvas}`} />}
          </Flex>
        ) : (
          <Skeleton width="100%" height="258px" />
        )}
        <Text p="24px 16px" color="textSubtle" textAlign="center">
          {t('Brag to your friends and annoy your rivals with your custom scorecard!')}
        </Text>
        {imageFromCanvas && (
          <>
            <StyledButton onClick={downloadImage}>{t('Download Image')}</StyledButton>
            <MobileText p="0 16px 18px 16px" bold textAlign="center">
              {t('Screenshot or press & hold the image to share!')}
            </MobileText>
          </>
        )}
      </Flex>
    </Modal>
  )
}

export default ShareImageModal
