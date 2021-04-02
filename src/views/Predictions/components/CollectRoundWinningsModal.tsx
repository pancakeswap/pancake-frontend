import React, { useState } from 'react'
import styled from 'styled-components'
import { useDispatch } from 'react-redux'
import {
  ModalContainer,
  ModalBody,
  ModalTitle,
  ModalCloseButton,
  ModalHeader,
  InjectedModalProps,
  Button,
  AutoRenewIcon,
  TrophyGoldIcon,
  Text,
  Flex,
  Heading,
} from '@pancakeswap-libs/uikit'
import { useWeb3React } from '@web3-react/core'
import { useToast } from 'state/hooks'
import { showHistory, updateRound } from 'state/predictions'
import useI18n from 'hooks/useI18n'
import { usePredictionsContract } from 'hooks/useContract'
import { formatBnb } from '../helpers'

interface CollectRoundWinningsModalProps extends InjectedModalProps {
  bnbToCollect: number
  epoch: number
  roundId: string
}

const BunnyDecoration = styled.div`
  position: absolute;
  top: -116px; // line up bunny at the top of the modal
  left: 0px;
  text-align: center;
  width: 100%;
`

const CollectRoundWinningsModal: React.FC<CollectRoundWinningsModalProps> = ({
  bnbToCollect,
  epoch,
  roundId,
  onDismiss,
}) => {
  const [isPendingTx, setIsPendingTx] = useState(false)
  const { account } = useWeb3React()
  const TranslateString = useI18n()
  const { toastSuccess, toastError } = useToast()
  const predictionsContract = usePredictionsContract()
  const dispatch = useDispatch()

  const handleClick = () => {
    predictionsContract.methods
      .claim(epoch)
      .send({ from: account })
      .on('sending', () => {
        setIsPendingTx(true)
      })
      .on('receipt', async () => {
        // Update round and history data
        await Promise.all([dispatch(updateRound({ id: roundId })), dispatch(showHistory({ account }))])

        setIsPendingTx(false)
        onDismiss()
        toastSuccess(TranslateString(999, 'Winnings collected!'))
      })
      .on('error', (error) => {
        setIsPendingTx(false)
        toastError('Error', error?.message)
        console.error(error)
      })
  }

  return (
    <ModalContainer minWidth="288px" position="relative" overflowY="visible" mt="124px">
      <BunnyDecoration>
        <img src="/images/decorations/prize-bunny.png" alt="bunny decoration" height="124px" width="168px" />
      </BunnyDecoration>
      <ModalHeader>
        <ModalTitle>
          <Heading>{TranslateString(556, 'Collect Winnings')}</Heading>
        </ModalTitle>
      </ModalHeader>
      <ModalBody p="24px">
        <TrophyGoldIcon width="96px" mx="auto" mb="24px" />
        <Flex alignItems="center" justifyContent="space-between" mb="24px">
          <Text>{TranslateString(999, 'Collecting')}</Text>
          <Text>{formatBnb(bnbToCollect)}</Text>
        </Flex>
        <Button
          width="100%"
          mb="8px"
          onClick={handleClick}
          isLoading={isPendingTx}
          endIcon={isPendingTx ? <AutoRenewIcon spin color="currentColor" /> : null}
        >
          {TranslateString(464, 'Confirm')}
        </Button>
        <Button variant="text" width="100%" onClick={onDismiss}>
          {TranslateString(999, 'Close Window')}
        </Button>
      </ModalBody>
    </ModalContainer>
  )
}

export default CollectRoundWinningsModal
