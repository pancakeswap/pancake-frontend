import React from 'react'
import { Box, Button, ChevronRightIcon, Flex, InjectedModalProps, Modal, Skeleton, Text } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import useGetVotingPower from 'views/Voting/hooks/useGetVotingPower'
import styled from 'styled-components'

interface CastVoteModalProps extends InjectedModalProps {
  vote: string
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

const CastVoteModal: React.FC<CastVoteModalProps> = ({ vote, block, onDismiss }) => {
  const { t } = useTranslation()
  const { votingPower, isInitialized } = useGetVotingPower(block)
  const { cakePool, cakeBnbLp, cakeBalance, pools } = votingPower
  const total = cakePool.plus(cakeBnbLp).plus(cakeBalance).plus(pools)

  return (
    <Modal title={t('Confirm Vote')} onDismiss={onDismiss}>
      <Box mb="24px" width="320px">
        <Text color="secondary" mb="8px" textTransform="uppercase" fontSize="12px" bold>
          {t('Voting For')}
        </Text>
        <Text bold fontSize="20px" mb="8px">
          {vote}
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
      <Button disabled width="100%" mb="8px">
        {t('Confirm Vote')}
      </Button>
      <Button variant="secondary" width="100%" onClick={onDismiss}>
        {t('Cancel')}
      </Button>
    </Modal>
  )
}

export default CastVoteModal
