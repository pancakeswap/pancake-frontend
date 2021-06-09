import React from 'react'
import { Box, Button, ChevronRightIcon, InjectedModalProps, Modal, Skeleton, Text } from '@pancakeswap/uikit'
import styled from 'styled-components'
import { useTranslation } from 'contexts/Localization'
import { useWeb3React } from '@web3-react/core'
import useWeb3 from 'hooks/useWeb3'
import useGetVotingPower from '../../hooks/useGetVotingPower'
import { SnapshotCommand } from '../../types'
import { generatePayloadData, Message, saveVotingPower, sendSnaphotData } from '../../helpers'

interface CastVoteModalProps extends InjectedModalProps {
  proposalId: string
  vote: {
    label: string
    value: number
  }
  block?: number
}

const VotingBox = styled.div`
  align-items: center;
  border: 1px solid ${({ theme }) => theme.colors.cardBorder};
  border-radius: 12px;
  cursor: pointer;
  display: flex;
  height: 64px;
  justify-content: space-between;
  margin-bottom: 24px;
  padding: 0 16px;
`

const CastVoteModal: React.FC<CastVoteModalProps> = ({ proposalId, vote, block, onDismiss }) => {
  const { t } = useTranslation()
  const { isInitialized, getTotal } = useGetVotingPower(block)
  const total = getTotal()
  const web3 = useWeb3()
  const { account } = useWeb3React()

  const handleConfirmVote = async () => {
    try {
      const voteMsg = JSON.stringify({
        ...generatePayloadData(),
        type: SnapshotCommand.VOTE,
        payload: {
          proposal: proposalId,
          choice: vote.value,
          metadata: {
            votingPower: total.toString(),
          },
        },
      })
      const sig = await web3.eth.personal.sign(voteMsg, account, null)
      const msg: Message = { address: account, msg: voteMsg, sig }

      // Save proposal to snapshot
      const data = await sendSnaphotData(msg)

      // Cache the voting power
      await saveVotingPower(account, data.ipfsHash, total.toString())

      onDismiss()
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <Modal title={t('Confirm Vote')} onDismiss={onDismiss}>
      <Box mb="24px" width="320px">
        <Text color="secondary" mb="8px" textTransform="uppercase" fontSize="12px" bold>
          {t('Voting For')}
        </Text>
        <Text bold fontSize="20px" mb="8px">
          {vote.label}
        </Text>
        <Text color="secondary" mb="8px" textTransform="uppercase" fontSize="12px" bold>
          {t('Your Voting Power')}
        </Text>
        {!isInitialized ? (
          <Skeleton height="64px" mb="24px" />
        ) : (
          <VotingBox>
            <Text bold fontSize="20px">
              {total.toFixed(3)}
            </Text>
            <ChevronRightIcon width="24px" />
          </VotingBox>
        )}
        <Text as="p" color="textSubtle" fontSize="14px">
          {t('Are you sure you want to vote for the above choice? This action cannot be undone.')}
        </Text>
      </Box>
      <Button disabled={!isInitialized} width="100%" mb="8px" onClick={handleConfirmVote}>
        {t('Confirm Vote')}
      </Button>
      <Button variant="secondary" width="100%" onClick={onDismiss}>
        {t('Cancel')}
      </Button>
    </Modal>
  )
}

export default CastVoteModal
