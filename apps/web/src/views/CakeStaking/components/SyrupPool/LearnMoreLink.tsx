import { useTranslation } from '@pancakeswap/localization'
import { Link } from '@pancakeswap/uikit'
import useTheme from 'hooks/useTheme'
import { memo } from 'react'
import NextLink from 'next/link'

export const LearnMoreLink: React.FC<{ withArrow?: boolean }> = ({ withArrow }) => {
  const { t } = useTranslation()
  const { theme } = useTheme()
  return (
    <Link
      style={{
        display: 'inline',
        color: withArrow ? theme.colors.yellow : 'white',
        textDecoration: 'underline',
        fontSize: 14,
        marginLeft: 3,
      }}
      href="https://docs.pancakeswap.finance/products/vecake/migrate-from-cake-pool"
      target="_blank"
      rel="noreferrer noopener"
    >
      {t('Learn more')}
      {withArrow && '»'}
    </Link>
  )
}

export const CakeStakingPageLink: React.FC = memo(() => {
  const { t } = useTranslation()
  return (
    <NextLink href="/cake-staking" passHref>
      <Link
        href="replace"
        style={{
          display: 'inline',
          textDecoration: 'underline',
          fontSize: 14,
          marginLeft: 3,
          color: 'white',
        }}
      >
        {t('CAKE staking page')}
      </Link>
    </NextLink>
  )
})
