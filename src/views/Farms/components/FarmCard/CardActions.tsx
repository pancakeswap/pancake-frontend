import React, { useMemo, useState } from 'react'
import BigNumber from 'bignumber.js'
import styled, { keyframes } from 'styled-components'
import { useWallet } from '@binance-chain/bsc-use-wallet'
import { Link as ReactRouterLink } from 'react-router-dom'
import { Button, Flex, Text } from '@pancakeswap-libs/uikit'
import { communityFarms } from 'sushi/lib/constants'
import { Farm } from 'state/types'
import { usePriceBnbBusd, usePriceCakeBusd } from 'state/hooks'
import useI18n from 'hooks/useI18n'
import UnlockButton from 'components/UnlockButton'
import ExpandableSectionButton from 'components/ExpandableSectionButton'
import { QuoteToken } from 'sushi/lib/constants/types'
import DetailsSection from './DetailsSection'
import CardHeading from './CardHeading'

const Action = styled.div`
  padding-top: 16px;
`

const RainbowLight = keyframes`
	0% {
		background-position: 0% 50%;
	}
	50% {
		background-position: 100% 50%;
	}
	100% {
		background-position: 0% 50%;
	}
`

export interface FarmWithStakedValue extends Farm {
  apy?: BigNumber
}

interface FarmCardActionsProps {
  farm: FarmWithStakedValue
}

const CardActions: React.FC<FarmCardActionsProps> = ({ farm }) => {
  const TranslateString = useI18n()
  const { account } = useWallet()

  return (
    <Action>
      {account ? (
        /* No full width props because of as={ReactRouterLink} */
        // @ts-ignore
        <Button as={ReactRouterLink} to={`/farms/${farm.lpSymbol}`} style={{ width: '100%' }}>
          {TranslateString(568, 'Select')}
        </Button>
      ) : (
        <UnlockButton fullWidth />
      )}
    </Action>
  )
}

export default CardActions
