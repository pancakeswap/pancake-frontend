import { useMemo } from 'react'
import BigNumber from 'bignumber.js'
import { Flex, LinkExternal, Text, Box, HelpIcon, useTooltip, RocketIcon, Link } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import styled from 'styled-components'
import { getBlockExploreLink } from 'utils'
import { formatNumber } from 'utils/formatBalance'
import useCurrentBlockTimestamp from 'hooks/useCurrentBlockTimestamp'
import { ModalInner, VotingBoxBorder, VotingBoxCardInner } from './styles'

const StyledLinkExternal = styled(LinkExternal)`
  display: inline-flex;
  font-size: 14px;
  > svg {
    width: 14px;
  }
`

const FixedTermWrapper = styled(Box)<{ expired?: boolean }>`
  width: 100%;
  margin: 16px 0;
  padding: 1px 1px 3px 1px;
  background: ${({ theme, expired }) => (expired ? theme.colors.warning : 'linear-gradient(180deg, #53dee9, #7645d9)')};
  border-radius: ${({ theme }) => theme.radii.default};
`

const FixedTermCardInner = styled(Box)<{ expired?: boolean }>`
  position: relative;
  z-index: 1;
  padding: 8px 12px;
  background: ${({ theme }) => theme.colors.backgroundAlt};
  border-radius: ${({ theme }) => theme.radii.default};

  &:before {
    position: absolute;
    content: '';
    top: 0;
    left: 0;
    z-index: -1;
    width: 100%;
    height: 100%;
    pointer-events: none;
    border-radius: ${({ theme }) => theme.radii.default};
    background: ${({ theme, expired }) => (expired ? 'rgba(255, 178, 55, 0.098)' : theme.colors.gradients.bubblegum)};
  }
`

const StyleLink = styled(Link)`
  text-decoration: underline;
`

interface DetailsViewProps {
  total: number
  cakeBalance?: number
  cakeVaultBalance?: number
  cakePoolBalance?: number
  poolsBalance?: number
  cakeBnbLpBalance?: number
  ifoPoolBalance?: number
  lockedCakeBalance?: number
  lockedEndTime?: number
  block: number
}

const DetailsView: React.FC<React.PropsWithChildren<DetailsViewProps>> = ({
  total,
  cakeBalance,
  cakeVaultBalance,
  cakePoolBalance,
  poolsBalance,
  cakeBnbLpBalance,
  ifoPoolBalance,
  lockedCakeBalance,
  lockedEndTime,
  block,
}) => {
  const { t } = useTranslation()
  const blockTimestamp = useCurrentBlockTimestamp()

  const isBoostingExpired = useMemo(() => {
    return lockedEndTime !== 0 && new BigNumber(blockTimestamp?.toString()).gte(lockedEndTime)
  }, [blockTimestamp, lockedEndTime])

  const { targetRef, tooltip, tooltipVisible } = useTooltip(
    <>
      {Number.isFinite(lockedCakeBalance) && (
        <Box>
          <Text>
            {isBoostingExpired
              ? t(
                  'Your vCAKE boosting was expired at the snapshot block. Renew your fixed-term staking position to activate the boost for future voting proposals.',
                )
              : t(
                  'Voting power is calculated using the staking amount and remaining staking duration of the fixed-term CAKE staking position at the block.',
                )}
          </Text>
          <Text bold m="10px 0">
            {`${t('CAKE locked:')} ${formatNumber(lockedCakeBalance, 0, 2)}`}
          </Text>
          <StyleLink href="/pools">{t('Go to Pools')}</StyleLink>
        </Box>
      )}
    </>,
    {
      placement: 'bottom',
    },
  )

  return (
    <ModalInner mb="0">
      <Text as="p" mb="24px" fontSize="14px" color="textSubtle">
        {t(
          'Your voting power is determined by the amount of CAKE you held and the remaining duration on the fixed-term staking position (if you have one) at the block detailed below. CAKE held in other places does not contribute to your voting power.',
        )}
      </Text>
      <Text color="secondary" textTransform="uppercase" mb="4px" bold fontSize="14px">
        {t('Overview')}
      </Text>
      <VotingBoxBorder>
        <VotingBoxCardInner>
          <Text color="secondary">{t('Your Voting Power')}</Text>
          <Text bold fontSize="20px">
            {formatNumber(total, 0, 3)}
          </Text>
        </VotingBoxCardInner>
      </VotingBoxBorder>
      <Text color="secondary" textTransform="uppercase" mb="4px" bold fontSize="14px">
        {t('Your voting power at block')}
        <StyledLinkExternal href={getBlockExploreLink(block, 'block')} ml="8px">
          {block}
        </StyledLinkExternal>
      </Text>
      {Number.isFinite(cakeBalance) && (
        <Flex alignItems="center" justifyContent="space-between" mb="4px">
          <Text color="textSubtle" fontSize="16px">
            {t('Wallet')}
          </Text>
          <Text textAlign="right">{formatNumber(cakeBalance, 0, 3)}</Text>
        </Flex>
      )}
      {Number.isFinite(cakeVaultBalance) && (
        <Flex alignItems="center" justifyContent="space-between" mb="4px">
          <Text color="textSubtle" fontSize="16px">
            {t('Flexible CAKE Staking')}
          </Text>
          <Text textAlign="right">{formatNumber(cakeVaultBalance, 0, 3)}</Text>
        </Flex>
      )}
      {Number.isFinite(cakePoolBalance) && (
        <>
          {lockedCakeBalance === 0 ? (
            <Flex alignItems="center" justifyContent="space-between" mb="4px">
              <Flex>
                <Text color="textSubtle" fontSize="16px">
                  {t('Fixed Term CAKE Staking')}
                </Text>
                {tooltipVisible && tooltip}
                <Flex ref={targetRef}>
                  <HelpIcon ml="4px" width="20px" height="20px" color="textSubtle" />
                </Flex>
              </Flex>
              <Text color="failure" textAlign="right">
                {formatNumber(cakePoolBalance, 0, 3)}
              </Text>
            </Flex>
          ) : (
            <FixedTermWrapper expired={isBoostingExpired}>
              <FixedTermCardInner expired={isBoostingExpired}>
                <Flex>
                  <Text color="textSubtle" fontSize="16px" mr="auto">
                    {t('Fixed Term CAKE Staking')}
                  </Text>
                  {tooltipVisible && tooltip}
                  <Flex ref={targetRef}>
                    <HelpIcon ml="4px" width="20px" height="20px" color="textSubtle" />
                  </Flex>
                </Flex>
                <Flex mt="10px" flexDirection="column" alignItems="flex-end">
                  <Text bold color={isBoostingExpired ? 'warning' : 'secondary'} fontSize="16px">
                    {formatNumber(cakePoolBalance, 0, 3)}
                  </Text>
                  <Flex>
                    <RocketIcon color={isBoostingExpired ? 'warning' : 'secondary'} width="15px" height="15px" />
                    <Text ml="4px" color={isBoostingExpired ? 'warning' : 'secondary'} fontSize="12px">
                      {isBoostingExpired ? t('Boosting Expired') : t('Boosted by vCAKE')}
                    </Text>
                  </Flex>
                </Flex>
              </FixedTermCardInner>
            </FixedTermWrapper>
          )}
        </>
      )}
      {Number.isFinite(ifoPoolBalance) && Number(ifoPoolBalance) > 0 && (
        <Flex alignItems="center" justifyContent="space-between" mb="4px">
          <Text color="textSubtle" fontSize="16px">
            {t('IFO Pool')}
          </Text>
          <Text textAlign="right">{formatNumber(ifoPoolBalance, 0, 3)}</Text>
        </Flex>
      )}
      {Number.isFinite(poolsBalance) && (
        <Flex alignItems="center" justifyContent="space-between" mb="4px">
          <Text color="textSubtle" fontSize="16px">
            {t('Other Syrup Pools')}
          </Text>
          <Text textAlign="right">{formatNumber(poolsBalance, 0, 3)}</Text>
        </Flex>
      )}
      {Number.isFinite(cakeBnbLpBalance) && (
        <Flex alignItems="center" justifyContent="space-between" mb="4px">
          <Text color="textSubtle" fontSize="16px">
            {t('CAKE BNB LP')}
          </Text>
          <Text textAlign="right">{formatNumber(cakeBnbLpBalance, 0, 3)}</Text>
        </Flex>
      )}
    </ModalInner>
  )
}

export default DetailsView
