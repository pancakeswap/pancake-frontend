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
} from '@pancakeswap/uikit'
import { useWeb3React } from '@web3-react/core'
import { getBscScanTransactionUrl } from 'utils/bscscan'
import { useAppDispatch } from 'state'
import { usePriceBnbBusd } from 'state/hooks'
import { fetchClaimableStatuses } from 'state/predictions'
import { useTranslation } from 'contexts/Localization'
import useToast from 'hooks/useToast'
import { usePredictionsContract } from 'hooks/useContract'

interface CollectRoundWinningsModalProps extends InjectedModalProps {
  payout: string
  betAmount: string
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
  betAmount,
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
  const dispatch = useAppDispatch()

  // Convert payout to number for compatibility
  const payoutAsFloat = parseFloat(payout)
  const betAmountAsFloat = parseFloat(betAmount)

  const handleClick = async () => {
    try {
      const tx = await predictionsContract.claim(epoch)
      setIsPendingTx(true)
      const receipt = await tx.wait()

      if (onSuccess) {
        await onSuccess()
      }

      await dispatch(fetchClaimableStatuses({ account, epochs: [epoch] }))
      onDismiss()
      setIsPendingTx(false)
      toastSuccess(
        t('Winnings collected!'),
        <Box>
          <Text as="p" mb="8px">
            {t('Your prizes have been sent to your wallet')}
          </Text>
          {receipt.transactionHash && (
            <LinkExternal href={getBscScanTransactionUrl(receipt.transactionHash)}>{t('View on BscScan')}</LinkExternal>
          )}
        </Box>,
      )
    } catch {
      toastError(t('Error'), t('Please try again. Confirm the transaction and make sure you are paying enough gas!'))
    } finally {
      setIsPendingTx(false)
    }
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
        <Flex alignItems="start" justifyContent="space-between" mb="8px">
          <Text>{t('Your position')}</Text>
          <Box style={{ textAlign: 'right' }}>
            <Text>{`${betAmount} BNB`}</Text>
            <Text fontSize="12px" color="textSubtle">
              {`~$${bnbBusdPrice.times(betAmountAsFloat).toFormat(2)}`}
            </Text>
          </Box>
        </Flex>
        <Flex alignItems="start" justifyContent="space-between" mb="24px">
          <Text>{t('Your winnings')}</Text>
          <Box style={{ textAlign: 'right' }}>
            <Text>{`${payout} BNB`}</Text>
            <Text fontSize="12px" color="textSubtle">
              {`~$${bnbBusdPrice.times(payoutAsFloat).toFormat(2)}`}
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
