import { useTranslation } from '@pancakeswap/localization'
import { LinkExternal, Text } from '@pancakeswap/uikit'
import { PropsWithChildren } from 'react'
import { displayApr } from '../../utils/displayApr'

type AprValue = {
  value: number | `${number}`
  boost?: number | `${number}`
}

type AprTooltipContentProps = {
  combinedApr: number
  cakeApr?: AprValue
  lpFeeApr: number
  merklApr?: number
  merklLink?: string
  showDesc?: boolean
}

export const AprTooltipContent: React.FC<PropsWithChildren<AprTooltipContentProps>> = ({
  combinedApr,
  cakeApr,
  lpFeeApr,
  merklApr,
  merklLink,
  showDesc = true,
  children,
}) => {
  const { t } = useTranslation()
  return (
    <>
      <Text fontSize="14px" color="textSubtle">
        {t('Combined APR')}: <b>{displayApr(combinedApr)}</b>
      </Text>
      <ul>
        {cakeApr ? (
          <li>
            {t('Farm APR')}:{cakeApr.boost ? <b>{displayApr(Number(cakeApr.boost ?? 0))}</b> : null}
            <b style={{ textDecoration: cakeApr.boost ? 'line-through' : 'none' }}>
              {displayApr(Number(cakeApr.value ?? 0))}
            </b>
          </li>
        ) : null}
        <li>
          {t('LP Fee APR')}: <b>{displayApr(lpFeeApr)}</b>
        </li>
        {merklApr && (
          <li>
            <Text fontSize="14px" color="textSubtle">
              {t('Merkl APR')}: <b>{displayApr(merklApr)}</b>
            </Text>
            <LinkExternal display="inline-block" href={merklLink}>
              {t('Check')}
            </LinkExternal>
          </li>
        )}
      </ul>

      {showDesc && (
        <>
          <br />
          {cakeApr?.boost && (
            <Text>
              {t('Calculated using the total active liquidity staked versus the CAKE reward emissions for the farm.')}
            </Text>
          )}
          <Text mt="15px">{t('APRs for individual positions may vary depending on the configs.')}</Text>
        </>
      )}
      {children}
    </>
  )
}

export const BCakeWrapperFarmAprTipContent = () => {
  const { t } = useTranslation()
  return (
    <Text mt="15px">
      {t('bCAKE only boosts Farm APR. Actual boost multiplier is subject to farm and pool conditions.')}
    </Text>
  )
}
