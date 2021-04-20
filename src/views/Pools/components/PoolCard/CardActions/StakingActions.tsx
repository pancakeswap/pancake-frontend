import React, { useState, useCallback } from 'react'
import { Flex, Box, Text, Button } from '@pancakeswap-libs/uikit'
import styled from 'styled-components'
import { useSousApprove } from 'hooks/useApprove'
import useI18n from 'hooks/useI18n'
import { useERC20 } from 'hooks/useContract'
import { useToast } from 'state/hooks'
import { getAddress } from 'utils/addressHelpers'
import { Token } from 'config/constants/types'

interface StakingActionsProps {
  stakingToken: Token
  needsApproval: boolean
  isOldSyrup: boolean
  isFinished: boolean
  sousId: number
}

const InlineText = styled(Text)`
  display: inline;
`

const StakingActions: React.FC<StakingActionsProps> = ({
  stakingToken,
  needsApproval,
  isOldSyrup,
  isFinished,
  sousId,
}) => {
  const TranslateString = useI18n()
  const stakingTokenContract = useERC20(stakingToken.address ? getAddress(stakingToken.address) : '')
  const [requestedApproval, setRequestedApproval] = useState(false)
  const { onApprove } = useSousApprove(stakingTokenContract, sousId)
  const { toastSuccess } = useToast()

  const handleApprove = useCallback(async () => {
    try {
      setRequestedApproval(true)
      const txHash = await onApprove()
      debugger // eslint-disable-line
      if (txHash) {
        toastSuccess('You have claimed your rewards!')
      }
      // user rejected tx or didn't go thru
      setRequestedApproval(false)
    } catch (e) {
      console.error(e)
    }
  }, [onApprove, setRequestedApproval, toastSuccess])

  return (
    <Flex flexDirection="column">
      <Box display="inline">
        <InlineText color="textSubtle" textTransform="uppercase" bold fontSize="12px">
          {TranslateString(1070, `stake`)}
        </InlineText>
        <InlineText color="secondary" textTransform="uppercase" bold fontSize="12px">
          {` ${stakingToken.symbol}`}
        </InlineText>
      </Box>
      {needsApproval && !isOldSyrup ? (
        // IS OLD SYRUP CONDITIONAL
        <Button disabled={isFinished || requestedApproval} onClick={handleApprove} width="100%">
          {TranslateString(999, 'Enable')}
        </Button>
      ) : (
        <span>Thing</span>
      )}
    </Flex>
  )
}

export default StakingActions
