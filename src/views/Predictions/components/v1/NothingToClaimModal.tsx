import { useEffect, useState } from 'react'
import { useWeb3React } from '@web3-react/core'
import styled from 'styled-components'
import {
  ModalContainer,
  ModalBody,
  ModalTitle,
  ModalHeader,
  InjectedModalProps,
  Text,
  Heading,
  ModalCloseButton,
  Button,
  AutoRenewIcon,
} from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import { getAllV1History } from './helpers'

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

const CollectRoundWinningsModal: React.FC<InjectedModalProps> = ({ onDismiss }) => {
  const [isFetching, setIsFetching] = useState(false)
  const [history, setHistory] = useState([])
  const { t } = useTranslation()
  const { account } = useWeb3React()

  const handleClick = () => {
    const header = [
      'Round',
      'Result',
      'Your Position',
      'Bet Amount',
      'Transaction',
      'Claimed Transaction',
      'Lock Price',
      'Close Price',
      'Total Bets',
      'Total Amount',
      'Round Failed',
    ].join(',')

    const rows = history.reduce((accum, bet) => {
      return [
        ...accum,
        [
          bet.round.epoch,
          bet.round.position,
          bet.position,
          bet.amount,
          bet.hash,
          bet.claimedHash || '',
          bet.round.lockPrice,
          bet.round.closePrice,
          bet.round.totalBets,
          bet.round.totalAmount,
          bet.round.failed,
        ].join(','),
      ]
    }, [])

    const anchor = document.createElement('a')
    const blob = new Blob([`${header}\n${rows.join('\n')}`], {
      type: 'text/csv;charset=utf-8;',
    })

    anchor.href = URL.createObjectURL(blob)
    anchor.target = '_blank'
    anchor.download = 'pancakeswap-prediction-v1-history.csv'

    document.body.appendChild(anchor)
    anchor.click()
    document.body.removeChild(anchor)
  }

  useEffect(() => {
    const fetchAllHistory = async () => {
      setIsFetching(true)

      try {
        const response = await getAllV1History({ user: account.toLowerCase() })
        setHistory(response)
      } catch (error) {
        console.error('Unable to fetch history', error)
      } finally {
        setIsFetching(false)
      }
    }

    if (account) {
      fetchAllHistory()
    }
  }, [account, setHistory, setIsFetching])

  return (
    <Modal minWidth="288px" position="relative" mt="124px">
      <BunnyDecoration>
        <img src="/images/decorations/prize-bunny.png" alt="bunny decoration" height="124px" width="168px" />
      </BunnyDecoration>
      <ModalHeader>
        <ModalTitle>
          <Heading>{t('Nothing to Collect')}</Heading>
        </ModalTitle>
        <ModalCloseButton onDismiss={onDismiss} />
      </ModalHeader>
      <ModalBody p="24px">
        <Text as="p" fontSize="14px">
          {t('You have no unclaimed v0.1 prizes.')}
        </Text>
        <Text as="p" fontSize="14px" mb="24px">
          {t('Download your v0.1 Prediction history below.')}
        </Text>
        <Button
          onClick={handleClick}
          isLoading={isFetching}
          endIcon={isFetching ? <AutoRenewIcon spin width="24px" color="white" /> : null}
        >
          {t('Download .CSV')}
        </Button>
      </ModalBody>
    </Modal>
  )
}

export default CollectRoundWinningsModal
