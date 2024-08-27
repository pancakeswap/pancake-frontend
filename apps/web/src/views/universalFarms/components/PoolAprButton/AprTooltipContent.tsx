import { useTranslation } from '@pancakeswap/localization'
import { LinkExternal, Text } from '@pancakeswap/uikit'
import { PropsWithChildren } from 'react'
import styled from 'styled-components'
import { displayApr } from '../../utils/displayApr'

const StyledLi = styled.li`
  flex-wrap: nowrap;
  display: flex;
  gap: 5px;
  position: relative;
  padding-left: 22px;
  &::before {
    content: '';
    position: absolute;
    transform: translateY(-50%);
    top: 50%;
    border-radius: 50%;
    left: 0;
    width: 6px;
    height: 6px;
    background: ${({ theme }) => theme.colors.text};
  }

  & > a {
    cursor: pointer;
  }
`

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
  expired?: boolean
}

export const AprTooltipContent: React.FC<PropsWithChildren<AprTooltipContentProps>> = ({
  combinedApr,
  cakeApr,
  lpFeeApr,
  merklApr,
  merklLink,
  showDesc = true,
  expired,
  children,
}) => {
  const { t } = useTranslation()
  const hasBoost = cakeApr?.boost && parseFloat(cakeApr.boost.toString()) > 0
  return (
    <>
      <Text>
        {t('Combined APR')}: <b>{displayApr(combinedApr)}</b>
      </Text>
      <ul>
        {cakeApr ? (
          <li>
            {t('Farm APR')}: &nbsp;&nbsp;
            {hasBoost ? (
              <>
                <b>{displayApr(Number(cakeApr.boost ?? 0))}</b>
                &nbsp;&nbsp;
              </>
            ) : null}
            <b style={{ textDecoration: hasBoost ? 'line-through' : 'none' }}>
              {displayApr(Number(cakeApr.value ?? 0))}
            </b>
          </li>
        ) : null}
        <li>
          {t('LP Fee APR')}:&nbsp;&nbsp;<b>{displayApr(lpFeeApr)}</b>
        </li>
        {merklApr && !expired ? (
          <StyledLi>
            <Text lineHeight={1.5}>
              {t('Merkl APR')}:&nbsp;&nbsp;<b>{displayApr(merklApr)}</b>
            </Text>
            <LinkExternal ml={2} href={merklLink}>
              {t('Check')}
            </LinkExternal>
          </StyledLi>
        ) : null}
      </ul>

      {showDesc && (
        <>
          <br />
          {cakeApr?.boost && (
            <Text>
              {/* {t('Calculated using the total active liquidity staked versus the CAKE reward emissions for the farm.')} */}
              {t(
                'Calculated using the total liquidity in the pool versus the total reward amount. Actual APR may be higher as some liquidity is not staked or not in-range.',
              )}
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
