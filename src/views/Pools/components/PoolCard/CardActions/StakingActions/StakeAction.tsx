import React, { useState, useCallback } from 'react'
import { Flex, Box, Text, Button, AutoRenewIcon } from '@pancakeswap-libs/uikit'
import BigNumber from 'bignumber.js'
import styled from 'styled-components'
import { useSousApprove } from 'hooks/useApprove'
import useI18n from 'hooks/useI18n'
import { useERC20 } from 'hooks/useContract'
import { useToast } from 'state/hooks'
import { getAddress } from 'utils/addressHelpers'
import { Token } from 'config/constants/types'
import ApprovalAction from './ApprovalAction'

interface StakeActionsProps {
  stakedBalance: BigNumber
}

const InlineText = styled(Text)`
  display: inline;
`

const StakeAction: React.FC<StakeActionsProps> = ({ stakedBalance }) => {
  const TranslateString = useI18n()

  return (
    <Flex flexDirection="column">
      {stakedBalance.toNumber() === 0 ? (
        <Button>{TranslateString(1070, 'Stake')}</Button>
      ) : (
        <Button>Stuff is staked</Button>
      )}
    </Flex>
  )
}

export default StakeAction
