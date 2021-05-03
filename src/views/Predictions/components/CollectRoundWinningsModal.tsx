import React, { useState } from 'react'
import styled from 'styled-components'
import {
  ModalContainer,
  ModalBody,
  ModalTitle,
  ModalHeader,
  InjectedModalProps,
  Button,
  AutoRenewIcon,
  TrophyGoldIcon,
  Text,
  Flex,
  Heading,
  Box,
  LinkExternal,
  ModalCloseButton,
} from '@pancakeswap-libs/uikit'
import { useWeb3React } from '@web3-react/core'
import { usePriceBnbBusd } from 'state/hooks'
import { useTranslation } from 'contexts/Localization'
import useToast from 'hooks/useToast'
import { usePredictionsContract } from 'hooks/useContract'
import { formatBnb } from '../helpers'

interface CollectRoundWinningsModalProps extends InjectedModalProps {
  payout: number
  epoch: number
  onSuccess?: () => Promise<void>
}

const Modal = styled(ModalContainer)`
  overflow: visible;
`

const BunnyDecoration = styled.div`
  position: absolute;
  top: -116px; // line up bunny at the top of the modal
  left: 0px;
  text-align: center;
  width: 100%;
`

const CollectRoundWinningsModal: React.FC<CollectRoundWinningsModalProps> = ({
  payout,
  epoch,
  onDismiss,
  onSuccess,
}) => {
  const [isPendingTx, setIsPendingTx] = useState(false)
  const { account } = useWeb3React()
  const { t } = useTranslation()
  const { toastSuccess, toastError } = useToast()
  const predictionsContract = usePredictionsContract()
  const bnbBusdPrice = usePriceBnbBusd()

  const handleClick = () => {
    predictionsContract.methods
      .claim(epoch)
      .send({ from: account })
      .once('sending', () => {
        setIsPendingTx(true)
      })
      .once('receipt', async (result) => {
        if (onSuccess) {
          await onSuccess()
        }

        setIsPendingTx(false)
        onDismiss()
        toastSuccess(
          t('Winnings collected!'),
          <Box>
            <Text as="p" mb="8px">
              {t('Your prizes have been sent to your wallet')}
            </Text>
            {result.transactionHash && (
              <LinkExternal href={`https://bscscan.com/tx/${result.transactionHash}`}>
                {t('View on BscScan')}
              </LinkExternal>
            )}
          </Box>,
        )
      })
      .once('error', (error) => {
        setIsPendingTx(false)
        toastError('Error', error?.message)
        console.error(error)
      })
  }

  return (
    <Modal minWidth="288px" position="relative" mt="124px">
      <BunnyDecoration>
        <img src="/images/decorations/prize-bunny.png" alt="bunny decoration" height="124px" width="168px" />
      </BunnyDecoration>
      <ModalHeader>
        <ModalTitle>
          <Heading>{t('Collect Winnings')}</Heading>
        </ModalTitle>
        <ModalCloseButton onDismiss={onDismiss} />
      </ModalHeader>
      <ModalBody p="24px">
        <TrophyGoldIcon width="96px" mx="auto" mb="24px" />
        <Flex alignItems="start" justifyContent="space-between" mb="24px">
          <Text>{t('Collecting')}</Text>
          <Box style={{ textAlign: 'right' }}>
            <Text>{formatBnb(payout)}</Text>
            <Text fontSize="12px" color="textSubtle">
              {`~$${formatBnb(bnbBusdPrice.times(payout).toNumber())}`}
            </Text>
          </Box>
        </Flex>
        <Button
          width="100%"
          mb="8px"
          onClick={handleClick}
          isLoading={isPendingTx}
          endIcon={isPendingTx ? <AutoRenewIcon spin color="currentColor" /> : null}
        >
          {t('Confirm')}
        </Button>
      </ModalBody>
    </Modal>
  )
}

export default CollectRoundWinningsModal
