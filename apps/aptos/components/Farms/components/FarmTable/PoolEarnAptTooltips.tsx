import { Coin } from '@pancakeswap/aptos-swap-sdk'
import { useTranslation } from '@pancakeswap/localization'
import { Box, Link, Text, TooltipText, useTooltip } from '@pancakeswap/uikit'
import { APT } from 'config/coins'
import { useActiveChainId } from 'hooks/useNetwork'
import { useMemo } from 'react'

interface PoolEarnAptTooltipsProps {
  lpLabel: string
  token: Coin
  quoteToken: Coin
}

export const PoolEarnAptTooltips: React.FunctionComponent<React.PropsWithChildren<PoolEarnAptTooltipsProps>> = ({
  lpLabel,
  token,
  quoteToken,
}) => {
  const { t } = useTranslation()
  const chainId = useActiveChainId()
  const APT_TOKEN_ADDRESS = APT[chainId].address.toLowerCase()

  const stakedToken = useMemo(() => {
    if (token.address.toLowerCase() !== APT_TOKEN_ADDRESS) {
      return token.symbol
    }
    return quoteToken.symbol
  }, [token.address, token.symbol, APT_TOKEN_ADDRESS, quoteToken.symbol])

  const { targetRef, tooltip, tooltipVisible } = useTooltip(
    <Box>
      <Box>
        <Text lineHeight="110%" as="span">
          {t('Stake %stakedToken%, Earn APT on', {
            stakedToken,
          })}
          <Link ml="4px" lineHeight="110%" display="inline !important" href="/pools">
            {t('%stakedToken% Syrup Pool', { stakedToken })}
          </Link>
        </Text>
      </Box>
      <Box mt="8px">
        <Text lineHeight="110%">
          {t(
            "If more %lpLabel% LP is deposited in our Farm this week, we'll increase APT rewards for %stakedToken% Syrup Pool next week.",
            {
              lpLabel,
              stakedToken,
            },
          )}
        </Text>
      </Box>
    </Box>,
    {
      placement: 'top',
    },
  )

  return (
    <Box ml="6px" height="16px" style={{ alignSelf: 'center', cursor: 'pointer' }}>
      <TooltipText ref={targetRef}>
        <Text fontSize={14}>🎁</Text>
      </TooltipText>
      {tooltipVisible && tooltip}
    </Box>
  )
}
