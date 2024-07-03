import { useTranslation } from '@pancakeswap/localization'
import { Box, CheckmarkCircleFillIcon, GlassGlobeIcon, useTooltip } from '@pancakeswap/uikit'
import styled from 'styled-components'
import { useConfig } from 'views/Predictions/context/ConfigProvider'
import { formatTokenv2 } from 'views/Predictions/helpers'

const BetBadge = styled(Box)<{ $variant?: 'primary' | 'secondary'; $type?: 'UP' | 'DOWN'; $position?: string }>`
  position: absolute;
  right: 20px;
  width: 70px;

  padding: 4px 0;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  user-select: none;
  z-index: 10;

  display: flex;
  align-items: center;

  color: ${({ theme, $variant }) => ($variant === 'primary' ? theme.colors.white : theme.colors.secondary)};
  border-radius: ${({ theme }) => theme.radii.small};
  background-color: ${({ theme, $variant }) =>
    $variant === 'primary' ? theme.colors.secondary : theme.colors.invertedContrast};

  border: ${({ theme, $variant }) => ($variant === 'secondary' ? `2px solid ${theme.colors.secondary}` : 'none')};
  border-left: none;
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;

  ${({ $type, $position }) =>
    $type === 'UP'
      ? `
    top: ${$position};
    `
      : `
    bottom: ${$position};
  `}

  &:before {
    content: '';
    width: 0;
    height: 0;

    position: absolute;
    left: ${({ $variant }) => ($variant === 'primary' ? '-1rem' : '-0.85rem')};

    border-top: 0.7rem solid transparent;
    border-bottom: 0.7rem solid transparent;
    border-right: ${({ theme, $variant }) =>
      $variant === 'primary'
        ? `1rem solid ${theme.colors.secondary}`
        : `0.9rem solid ${theme.colors.invertedContrast}`};

    z-index: 10;
  }

  &:after {
    content: '';
    width: 0;
    height: 0;

    position: absolute;
    left: -1rem;

    border-top: 0.85rem solid transparent;
    border-bottom: 0.85rem solid transparent;
    border-right: 1rem solid
      ${({ theme, $variant }) => ($variant === 'secondary' ? theme.colors.secondary : 'transparent')};

    z-index: 9;
  }
`

interface BetBadgeStackProps {
  aiBetType?: 'UP' | 'DOWN'
  aiBetPosition?: string

  userBetType?: 'UP' | 'DOWN'
  userBetPosition?: string

  betAmount?: bigint
}

export const BetBadgeStack = ({
  aiBetPosition = '20px',
  userBetPosition = '20px',
  aiBetType,
  userBetType,
  betAmount,
}: BetBadgeStackProps) => {
  const { t } = useTranslation()
  const config = useConfig()

  const {
    tooltip: aiTooltip,
    tooltipVisible: aiTooltipVisible,
    targetRef: aiTargetRef,
  } = useTooltip(t("AI's prediction"))

  const {
    tooltip: userTooltip,
    tooltipVisible: userTooltipVisible,
    targetRef: userTargetRef,
  } = useTooltip(
    <>
      {t('My position: %position% AI', { position: userBetType === aiBetType ? t('Follow') : t('Against') })}
      <br />
      {betAmount && (
        <>
          ({formatTokenv2(betAmount, config?.token?.decimals ?? 0, config?.displayedDecimals ?? 4)}{' '}
          {config?.token.symbol})
        </>
      )}
    </>,
  )

  return (
    <>
      {aiBetType && (
        <BetBadge
          ref={aiTargetRef}
          $variant="primary"
          $type={aiBetType}
          $position={aiBetType !== userBetType || userBetType === 'DOWN' ? '46px' : aiBetPosition}
        >
          <GlassGlobeIcon width={14} />
          <span style={{ margin: '0 0 0 3px' }}>{t("AI's Bet")}</span>
          {aiTooltipVisible && aiTooltip}
        </BetBadge>
      )}
      {userBetType && (
        <BetBadge
          ref={userTargetRef}
          $variant="secondary"
          $type={userBetType}
          $position={aiBetType !== userBetType || aiBetType === 'UP' ? '40px' : userBetPosition}
        >
          <CheckmarkCircleFillIcon color="secondary" width={14} />
          <span style={{ margin: '0.5px 0 0 3px' }}>{t('My Bet')}</span>
          {userTooltipVisible && userTooltip}
        </BetBadge>
      )}
    </>
  )
}
