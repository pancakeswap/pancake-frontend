import React, { useMemo, useState, useCallback } from 'react'
import BigNumber from 'bignumber.js'
import styled from 'styled-components'
import { useWallet } from '@binance-chain/bsc-use-wallet'
import { Contract } from 'web3-eth-contract'
import { provider } from 'web3-core'
import { getContract } from 'utils/erc20'
import { Button, Flex, Heading, Text } from '@pancakeswap-libs/uikit'
import { Farm } from 'state/types'
import { useFarmFromSymbol, useFarmUser } from 'state/hooks'
import useI18n from 'hooks/useI18n'
import UnlockButton from 'components/UnlockButton'
import { useApprove } from 'hooks/useApprove'
import { getBalanceNumber } from 'utils/formatBalance'

interface FarmCardActionsProps {
  isStaking?: boolean
  balance?: BigNumber
}

const FarmAction: React.FC<FarmCardActionsProps> = ({ balance, isStaking }) => {
  const TranslateString = useI18n()

  const displayBalance = getBalanceNumber(balance)

  return (
    <Flex justifyContent="space-between" alignItems="center">
      <Heading color={displayBalance === 0 ? 'textDisabled' : 'text'}>{displayBalance}</Heading>
      <Button>Stake LP</Button>
    </Flex>
  )
}

export default FarmAction
