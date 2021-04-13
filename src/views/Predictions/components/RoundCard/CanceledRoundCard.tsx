import React, { useEffect, useState } from 'react'
import { CardBody, Text, Flex, BlockIcon, Link, InfoIcon, Button, AutoRenewIcon } from '@pancakeswap-libs/uikit'
import { useWeb3React } from '@web3-react/core'
import useI18n from 'hooks/useI18n'
import { Round, BetPosition } from 'state/types'
import { useGetTotalIntervalBlocks, useToast } from 'state/hooks'
import { usePredictionsContract } from 'hooks/useContract'
import { RoundResultBox } from '../RoundResult'
import MultiplierArrow from './MultiplierArrow'
import Card from './Card'
import CardHeader from './CardHeader'

interface CanceledRoundCardProps {
  round: Round
}

const CanceledRoundCard: React.FC<CanceledRoundCardProps> = ({ round }) => {
  const [isRefundable, setIsRefundable] = useState(false)
  const [isPendingTx, setIsPendingTx] = useState(false)
  const TranslateString = useI18n()
  const interval = useGetTotalIntervalBlocks()
  const { account } = useWeb3React()
  const predictionsContract = usePredictionsContract()
  const { toastSuccess, toastError } = useToast()

  const { epoch, startBlock } = round
  const estimatedEndBlock = startBlock + interval

  const handleReclaim = () => {
    predictionsContract.methods
      .claim(epoch)
      .send({ from: account })
      .once('sending', () => {
        setIsPendingTx(true)
      })
      .once('receipt', async () => {
        setIsRefundable(false)
        setIsPendingTx(false)
        toastSuccess(TranslateString(999, 'Position reclaimed!'))
      })
      .once('error', (error) => {
        setIsPendingTx(false)
        toastError('Error', error?.message)
        console.error(error)
      })
  }

  useEffect(() => {
    const fetchRefundableStatus = async () => {
      const canClaim = await predictionsContract.methods.claimable(epoch, account).call()

      if (canClaim) {
        const refundable = await predictionsContract.methods.refundable(epoch, account).call()
        setIsRefundable(refundable)
      }
    }

    if (account) {
      fetchRefundableStatus()
    }
  }, [account, epoch, predictionsContract, setIsRefundable])

  return (
    <Card>
      <CardHeader
        status="canceled"
        icon={<BlockIcon mr="4px" width="21px" />}
        title={TranslateString(999, 'Canceled')}
        epoch={round.epoch}
        blockNumber={estimatedEndBlock}
      />
      <CardBody p="16px">
        <MultiplierArrow isDisabled />
        <RoundResultBox>
          <Flex flexDirection="column" alignItems="center">
            <Text bold color={isRefundable ? 'text' : 'textDisabled'}>
              {TranslateString(999, 'Round Canceled')}
            </Text>
            {isRefundable && (
              <Button
                width="100%"
                my="8px"
                onClick={handleReclaim}
                isLoading={isPendingTx}
                endIcon={isPendingTx ? <AutoRenewIcon spin color="white" /> : null}
              >
                {TranslateString(999, 'Reclaim Position')}
              </Button>
            )}
            <Link href="https://pancakeswap.finance" external>
              <InfoIcon color="primary" mr="4px" /> {TranslateString(999, 'Learn More')}
            </Link>
          </Flex>
        </RoundResultBox>
        <MultiplierArrow betPosition={BetPosition.BEAR} isDisabled />
      </CardBody>
    </Card>
  )
}

export default CanceledRoundCard
