import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useWeb3React } from '@web3-react/core'
import styled from 'styled-components'
import { Button, Flex, TrophyGoldIcon } from '@pancakeswap-libs/uikit'
import useI18n from 'hooks/useI18n'
import { usePredictionsContract } from 'hooks/useContract'
import { useToast } from 'state/hooks'
import { updateRound } from 'state/predictions'

interface CollectWinningsOverlayProps {
  roundId: string
  epoch: number
  isBottom?: boolean
}

const Wrapper = styled(Flex)<{ isBottom: CollectWinningsOverlayProps['isBottom'] }>`
  background-color: ${({ theme }) => theme.colors.secondary};
  left: 0;
  position: absolute;
  width: 100%;
  z-index: 30;

  ${({ isBottom }) => {
    return isBottom
      ? `
      border-radius: 0 0 16px 16px;
      bottom: 0;
    `
      : `
      top: 0;
    `
  }}
`

const CollectWinningsOverlay: React.FC<CollectWinningsOverlayProps> = ({
  roundId,
  epoch,
  isBottom = false,
  ...props
}) => {
  const [isPendingTx, setIsPendingTx] = useState(false)
  const TranslateString = useI18n()
  const predictionsContract = usePredictionsContract()
  const { account } = useWeb3React()
  const { toastSuccess, toastError } = useToast()
  const dispatch = useDispatch()

  const handleClick = () => {
    predictionsContract.methods
      .claim(epoch)
      .send({ from: account })
      .on('sending', () => {
        setIsPendingTx(true)
      })
      .on('receipt', async () => {
        await dispatch(updateRound({ id: roundId }))
        setIsPendingTx(false)
        toastSuccess(TranslateString(999, 'Winnings collected!'))
      })
      .on('error', (error) => {
        setIsPendingTx(false)
        toastError('Error', error?.message)
        console.error(error)
      })
  }

  return (
    <Wrapper alignItems="center" p="16px" isBottom={isBottom} {...props}>
      <TrophyGoldIcon width="64px" style={{ flex: 'none' }} mr="8px" />
      <Button width="100%" onClick={handleClick} isLoading={isPendingTx}>
        {TranslateString(556, 'Collect Winnings')}
      </Button>
    </Wrapper>
  )
}

export default CollectWinningsOverlay
