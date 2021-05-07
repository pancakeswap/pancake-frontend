import React, { useEffect, useRef, useState } from 'react'
import { useWeb3React } from '@web3-react/core'
import styled, { css, keyframes } from 'styled-components'
import { Button, CloseIcon, IconButton, TrophyGoldIcon } from '@pancakeswap/uikit'
import { CSSTransition } from 'react-transition-group'
import { useTranslation } from 'contexts/Localization'
import { getBetHistory } from 'state/predictions/helpers'
import { useGetPredictionsStatus, useIsHistoryPaneOpen } from 'state/hooks'
import { useAppDispatch } from 'state'
import { setHistoryPaneState } from 'state/predictions'

/**
 * @see https://github.com/animate-css/animate.css/tree/main/source
 */
const bounceInKeyframe = keyframes`
  from,
  60%,
  75%,
  90%,
  to {
    animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
  }

  from {
    opacity: 0;
    transform: translate3d(0, 3000px, 0) scaleY(5);
  }

  60% {
    opacity: 1;
    transform: translate3d(0, -20px, 0) scaleY(0.9);
  }

  75% {
    transform: translate3d(0, 10px, 0) scaleY(0.95);
  }

  90% {
    transform: translate3d(0, -5px, 0) scaleY(0.985);
  }

  to {
    transform: translate3d(0, 0, 0);
  }
`

const bounceOutKeyframe = keyframes`
  20% {
    transform: translate3d(0, 10px, 0) scaleY(0.985);
  }

  40%,
  45% {
    opacity: 1;
    transform: translate3d(0, -20px, 0) scaleY(0.9);
  }

  to {
    opacity: 0;
    transform: translate3d(0, 2000px, 0) scaleY(3);
  }
`

const bounceInAnimation = css`
  animation: ${bounceInKeyframe} 1s;
`

const bounceOutAnimation = css`
  animation: ${bounceOutKeyframe} 1s;
`

const Wrapper = styled.div`
  align-items: center;
  bottom: 72px;
  color: #ffffff;
  display: flex;
  justify-content: center;
  left: 0;
  padding-left: 16px;
  padding-right: 16px;
  position: absolute;
  width: 100%;
  z-index: 50;

  &.popup-enter-active {
    ${bounceInAnimation}
  }

  &.popup-enter-done {
    bottom: 72px;
  }

  &.popup-exit-done {
    bottom: -2000px;
  }

  &.popup-exit-active {
    ${bounceOutAnimation}
  }

  ${({ theme }) => theme.mediaQueries.md} {
    bottom: 16px;
    justify-content: flex-end;

    &.popup-enter-done {
      bottom: 16px;
    }
  }
`

const Popup = styled.div`
  align-items: center;
  background-color: ${({ theme }) => theme.colors.secondary};
  border-radius: 32px;
  color: #ffffff;
  display: flex;
  max-width: 320px;
  padding: 16px 8px;
`

const CollectWinningsPopup = () => {
  const [isOpen, setIsOpen] = useState(false)
  const { t } = useTranslation()
  const ref = useRef(null)
  const timer = useRef(null)
  const { account } = useWeb3React()
  const predictionStatus = useGetPredictionsStatus()
  const isHistoryPaneOpen = useIsHistoryPaneOpen()
  const dispatch = useAppDispatch()

  const handleOpenHistory = () => {
    dispatch(setHistoryPaneState(true))
  }

  const handleClick = () => {
    setIsOpen(false)
    clearInterval(timer.current)
  }

  // Check user's history for unclaimed winners
  useEffect(() => {
    if (account) {
      timer.current = setInterval(async () => {
        const bets = await getBetHistory({ user: account.toLowerCase(), claimed: false })

        // Filter out bets that were not winners
        const winnerBets = bets.filter((bet) => {
          return bet.position === bet.round.position
        })

        if (!isHistoryPaneOpen) {
          setIsOpen(winnerBets.length > 0)
        }
      }, 30000)
    }

    return () => {
      clearInterval(timer.current)
    }
  }, [account, timer, predictionStatus, setIsOpen, isHistoryPaneOpen])

  // Any time the history pane is open make sure the popup closes
  useEffect(() => {
    if (isHistoryPaneOpen) {
      setIsOpen(false)
    }
  }, [isHistoryPaneOpen, setIsOpen])

  return (
    <CSSTransition in={isOpen} unmountOnExit nodeRef={ref} timeout={1000} classNames="popup">
      <Wrapper ref={ref}>
        <Popup>
          <TrophyGoldIcon width="64px" style={{ flex: 'none' }} mr="8px" />
          <Button style={{ flex: 1 }} onClick={handleOpenHistory}>
            {t('Collect Winnings')}
          </Button>
          <IconButton variant="text" onClick={handleClick}>
            <CloseIcon color="primary" width="24px" />
          </IconButton>
        </Popup>
      </Wrapper>
    </CSSTransition>
  )
}

export default CollectWinningsPopup
