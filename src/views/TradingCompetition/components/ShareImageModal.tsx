import React, { useRef, useState, useEffect } from 'react'
import { Modal, Flex, Button, Text, Skeleton, Box } from '@pancakeswap-libs/uikit'
import styled from 'styled-components'
import useI18n from 'hooks/useI18n'
import FlippersShare from '../pngs/flippers-share.png'
import StormShare from '../pngs/storm-share.png'
import CakersShare from '../pngs/cakers-share.png'
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
  const TranslateString = useI18n()
  const { global, team, volume } = userLeaderboardInformation
  const [bgImage, setBgImage] = useState(null)
  const [profileImage, setProfileImage] = useState(null)
  const [imageFromCanvas, setImageFromCanvas] = useState(null)
  const canvas = useRef(null)

  useEffect(() => {
    const bgImages = [StormShare, FlippersShare, CakersShare]
    const bgImagEl = new Image()
    bgImagEl.src = bgImages[profile.teamId - 1]
    bgImagEl.onload = () => setBgImage(bgImagEl)

    const profileImageEl = new Image()
    profileImageEl.src = `/images/nfts/${profile.nft?.images?.lg}`
    profileImageEl.onload = () => setProfileImage(profileImageEl)
  }, [profile])

  useEffect(() => {
    if (canvas && bgImage && profileImage) {
      const canvasWidth = canvas.current.width
      canvas.current.height = canvasWidth * 0.5625
      const canvasHeight = canvas.current.height

      const ctx = canvas.current.getContext('2d')

      ctx.drawImage(bgImage, 0, 0, canvasWidth, canvasHeight)
      ctx.drawImage(profileImage, canvasWidth * 0.0325, canvasHeight * 0.07, canvasWidth * 0.19, canvasWidth * 0.19)

      ctx.font = 'bold 84px Kanit'
      ctx.fillStyle = 'white'
      ctx.fillText(`@${profile.username}`, canvasWidth * 0.033, canvasHeight * 0.53)

      ctx.font = 'bold 72px Kanit'
      ctx.fillText(`# ${team.toLocaleString()}`, canvasWidth * 0.18, canvasHeight * 0.69)
      ctx.fillText(`# ${global.toLocaleString()}`, canvasWidth * 0.18, canvasHeight * 0.79)
      ctx.fillText(`$ ${localiseTradingVolume(volume)}`, canvasWidth * 0.18, canvasHeight * 0.89)

      setImageFromCanvas(canvas.current.toDataURL('image/png'))
    }
  }, [canvas, bgImage, profileImage, team, global, volume, profile])

  const downloadImage = () => {
    const link = document.createElement('a')
    link.download = `easter-battle-${profile.username}.png`
    link.href = imageFromCanvas
    link.click()
  }

  return (
    <Modal title={`${TranslateString(999, 'Share Your Score')}`} onDismiss={onDismiss} minWidth="280px">
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
          {TranslateString(999, 'Brag to your friends and annoy your rivals with your custom scorecard!')}
        </Text>
        {imageFromCanvas && (
          <>
            <StyledButton onClick={downloadImage}>{TranslateString(999, 'Download Image')}</StyledButton>
            <MobileText p="0 16px 18px 16px" bold textAlign="center">
              {TranslateString(999, 'Screenshot or press & hold the image to share!')}
            </MobileText>
          </>
        )}
      </Flex>
    </Modal>
  )
}

export default ShareImageModal
