import { useTranslation } from '@pancakeswap/localization'
import { Flex, LinkExternal, Skeleton, Text, TooltipText, useTooltip } from '@pancakeswap/uikit'
import { FarmWidget } from '@pancakeswap/widgets-internal'
import { useMemo } from 'react'
import { usePoolApr } from 'state/farmsV4/hooks'
import { PoolInfo } from 'state/farmsV4/state/type'
import { getMerklLink } from 'utils/getMerklLink'

const displayApr = (apr: number, maximumFractionDigits = 2) =>
  (apr * 100).toLocaleString('en-US', { maximumFractionDigits })

const AprTooltip: React.FC<{
  pool: PoolInfo
  hasBoost: boolean
  combinedBoostedApr: number
  combinedBaseApr: number
}> = ({ hasBoost, pool, combinedBaseApr, combinedBoostedApr }) => {
  const { t } = useTranslation()
  const key = useMemo(() => `${pool.chainId}:${pool.lpAddress}` as const, [pool.chainId, pool.lpAddress])
  const { lpApr, cakeApr, merklApr } = usePoolApr(key)
  const merklLink = useMemo(() => {
    return getMerklLink({ chainId: pool.chainId, lpAddress: pool.lpAddress })
  }, [pool.chainId, pool.lpAddress])

  return (
    <>
      <Text>
        {t('Combined APR')}: <b>{displayApr(hasBoost ? combinedBoostedApr : combinedBaseApr)}%</b>
      </Text>
      <ul>
        {cakeApr ? (
          <li>
            {t('Farm APR')}:{' '}
            <b>
              {hasBoost && <>{displayApr(Number(cakeApr?.boost ?? 0))}% </>}
              <Text
                display="inline-block"
                style={{ textDecoration: hasBoost ? 'line-through' : 'none', fontWeight: 800 }}
              >
                {displayApr(Number(cakeApr?.value ?? 0))}%
              </Text>
            </b>
          </li>
        ) : null}
        <li>
          {t('LP Fee APR')}: <b>{displayApr(Number(lpApr ?? 0))}%</b>
        </li>
        {merklApr ? (
          <li>
            {t('merkl APR')}: <b>{displayApr(Number(merklApr ?? 0))}%</b>
            <LinkExternal display="inline-block" href={merklLink}>
              {t('Check')}
            </LinkExternal>
          </li>
        ) : null}
      </ul>
      <br />
      <Text>
        {t('Calculated using the total active liquidity staked versus the CAKE reward emissions for the farm.')}
      </Text>
      {hasBoost && ['v2', 'stable'].includes(pool.protocol) && (
        <Text mt="15px">
          {t('bCAKE only boosts Farm APR. Actual boost multiplier is subject to farm and pool conditions.')}
        </Text>
      )}
      <Text mt="15px">{t('APRs for individual positions may vary depending on the configs.')}</Text>
    </>
  )
}

export const PoolApyButton: React.FC<{ pool: PoolInfo }> = ({ pool }) => {
  const { t } = useTranslation()
  const key = useMemo(() => `${pool.chainId}:${pool.lpAddress}` as const, [pool.chainId, pool.lpAddress])
  const { lpApr, cakeApr, merklApr } = usePoolApr(key)
  // @todo @ChefJerry display user apr if staking
  const userIsStaking = false
  const hasBoost = useMemo(() => Boolean(parseFloat(cakeApr?.boost ?? '0')), [cakeApr?.boost])
  const combinedBaseApr = useMemo(() => {
    return Number(lpApr ?? 0) + Number(cakeApr?.value ?? 0) + Number(merklApr ?? 0)
  }, [lpApr, cakeApr, merklApr])
  const combinedBoostedApr = useMemo(() => {
    return Number(lpApr ?? 0) + Number(cakeApr?.boost ?? 0) + Number(merklApr ?? 0)
  }, [lpApr, cakeApr, merklApr])
  const aprTooltip = useTooltip(
    <AprTooltip
      pool={pool}
      hasBoost={hasBoost}
      combinedBaseApr={combinedBaseApr}
      combinedBoostedApr={combinedBoostedApr}
    />,
    {
      trigger: 'click',
    },
  )

  if (!lpApr) {
    return <Skeleton height={24} width={80} style={{ borderRadius: '12px' }} />
  }

  return (
    <>
      <FarmWidget.FarmApyButton
        variant="text-and-button"
        handleClickButton={(e) => {
          e.stopPropagation()
          e.preventDefault()
          // roiModal.onOpen()
        }}
      >
        <TooltipText decorationColor="secondary" ref={aprTooltip.targetRef}>
          <Flex ml="4px" mr="5px" style={{ gap: 5 }}>
            {hasBoost && (
              <>
                <Text bold color="success" fontSize={16}>
                  <>
                    <Text bold color="success" fontSize={16} display="inline-block" mr="3px">
                      🌿
                      {t('Up to')}
                    </Text>
                    {`${displayApr(combinedBoostedApr)}%`}
                  </>
                </Text>
              </>
            )}
            <Text style={{ textDecoration: hasBoost ? 'line-through' : 'none' }}>{displayApr(combinedBaseApr)}%</Text>
          </Flex>
        </TooltipText>
      </FarmWidget.FarmApyButton>
      {aprTooltip.tooltipVisible && aprTooltip.tooltip}
    </>
  )
}
