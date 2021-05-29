import React from 'react'
import BigNumber from 'bignumber.js'
import styled from 'styled-components'
import { getBalanceNumber } from 'utils/formatBalance'
import { useTranslation } from 'contexts/Localization'
import {
  Flex,
  MetamaskIcon,
  Text,
  TooltipText,
  LinkExternal,
  TimerIcon,
  Skeleton,
  useTooltip,
} from '@rug-zombie-libs/uikit'
import { BASE_BSC_SCAN_URL, BASE_URL } from 'config'
import { useBlock } from 'state/hooks'
import { Pool } from 'state/types'
import { getAddress, getCakeVaultAddress } from 'utils/addressHelpers'
import { registerToken } from 'utils/wallet'
import Balance from 'components/Balance'
import tokens from '../../../../../config/constants/tokens'
import { GraveConfig } from '../../../../../config/constants/types'

interface ExpandedFooterProps {
  account: string
  grave: GraveConfig
  totalZombieInGrave?: BigNumber
}

const ExpandedWrapper = styled(Flex)`
  svg {
    height: 14px;
    width: 14px;
  }
`

const ExpandedFooter: React.FC<ExpandedFooterProps> = ({
  account,
  grave,
  totalZombieInGrave,
}) => {
  const { currentBlock } = useBlock()

  const graveContractAddress = getAddress(grave.contractAddress)
  const imageSrc = `${BASE_URL}/images/tokens/${tokens.zmbe.symbol.toLowerCase()}.png`
  const isMetaMaskInScope = !!(window as WindowChain).ethereum?.isMetaMask

  const { targetRef, tooltip, tooltipVisible } = useTooltip(
    'Subtracted automatically from each yield harvest and burned.',
    { placement: 'bottom-end' },
  )

  return (
    <ExpandedWrapper flexDirection="column">
      <Flex mb="2px" justifyContent="space-between" alignItems="center">
        <Text small>Total staked:</Text>
        <Flex alignItems="flex-start">
          {totalZombieInGrave ? (
            <>
              <Balance
                fontSize="14px"
                value={getBalanceNumber(totalZombieInGrave, tokens.zmbe.decimals)}
              />
              <Text ml="4px" fontSize="14px">
                {tokens.zmbe.symbol}
              </Text>
            </>
          ) : (
            <Skeleton width="90px" height="21px" />
          )}
        </Flex>
      </Flex>
        <Flex mb="2px" justifyContent="space-between" alignItems="center">
          {tooltipVisible && tooltip}
          <TooltipText ref={targetRef} small>
            Early withdrawal Fee:
          </TooltipText>
          <Flex alignItems="center">
            <Text ml="4px" small>
              {grave.earlyWithdrawalFee * 100}%
            </Text>
          </Flex>
        </Flex>
      <Flex mb="2px" justifyContent="flex-end">
        <LinkExternal bold={false} small href={grave.artistUrl}>
          View NFT Artist
        </LinkExternal>
      </Flex>
      {graveContractAddress && (
        <Flex mb="2px" justifyContent="flex-end">
          <LinkExternal
            bold={false}
            small
            href={`${BASE_BSC_SCAN_URL}/address/${graveContractAddress}`}
          >
            View Contract
          </LinkExternal>
        </Flex>
      )}
      {account && isMetaMaskInScope && tokens.zmbe.address && (
        <Flex justifyContent="flex-end">
          <Text
            color="primary"
            small
            onClick={() => registerToken(getAddress(tokens.zmbe.address), tokens.zmbe.symbol, tokens.zmbe.decimals, imageSrc)}
          >
            Add to Metamask
          </Text>
          <MetamaskIcon ml="4px" />
        </Flex>
      )}
    </ExpandedWrapper>
  )
}

export default React.memo(ExpandedFooter)
