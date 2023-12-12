import { useTranslation } from '@pancakeswap/localization'
import {
  ArrowForwardIcon,
  Box,
  Button,
  Flex,
  Grid,
  HelpIcon,
  Link,
  Text,
  useMatchBreakpoints,
} from '@pancakeswap/uikit'
import { NextLinkFromReactRouter } from '@pancakeswap/widgets-internal'
import { useMemo } from 'react'
import styled, { css } from 'styled-components'
import { useCakeLockStatus } from '../hooks/useVeCakeUserInfo'
import { CakeLockStatus } from '../types'
import { HeadBunny, MobileHeadBunny } from './HeadImage'

export const PageHead = () => {
  const { t } = useTranslation()

  return (
    <Flex justifyContent="space-between" flexDirection="row">
      <Flex flex="1" flexDirection="column" mr={[0, 0, '8px']}>
        <Heading />
        <Description />
        <NextLinkFromReactRouter
          to="/swap?chain=bsc&inputCurrency=BNB&outputCurrency=0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82"
          prefetch={false}
        >
          <Button p="0" variant="text" mt="4px">
            <Text color="primary" bold fontSize="16px" mr="4px">
              {t('Get CAKE')}
            </Text>
            <ArrowForwardIcon color="primary" />
          </Button>
        </NextLinkFromReactRouter>
      </Flex>

      <Box>
        <HeadBunny />
      </Box>
    </Flex>
  )
}

const Heading = () => {
  const { t } = useTranslation()
  const { isMobile } = useMatchBreakpoints()
  const { status } = useCakeLockStatus()
  const staking = useMemo(() => status === CakeLockStatus.Locking, [status])

  return (
    <Flex alignItems="baseline" justifyContent={staking ? 'space-between' : undefined}>
      <Text lineHeight="110%" bold color="secondary" mb="16px" fontSize={['32px', '32px', '64px', '64px']}>
        {t('CAKE Staking')}
      </Text>
      {isMobile ? (
        <Link
          external
          href="https://docs.pancakeswap.finance/products/vecake/how-to-get-vecake"
          style={{ textDecoration: 'none', zIndex: 1 }}
        >
          <Button width="48px" height="48px" variant="subtle" ml={staking ? 0 : '16px'}>
            <HelpIcon ml="0" color="white" width="24px" />
          </Button>
        </Link>
      ) : null}
    </Flex>
  )
}

const DescriptionContent = styled(Box).withConfig({
  shouldForwardProp: (props) => props !== 'fullSize',
})<{
  fullSize?: boolean
}>`
  max-width: 196px;

  @media screen and (min-width: 360px) {
    max-width: 243px;
  }

  ${({ theme }) => theme.mediaQueries.md} {
    max-width: 537px;
  }

  ${({ fullSize }) =>
    fullSize
      ? css`
          max-width: 100% !important;
        `
      : null}
`

const Description = () => {
  const { t } = useTranslation()
  const { status } = useCakeLockStatus()
  const { isMobile } = useMatchBreakpoints()
  const staking = useMemo(() => status === CakeLockStatus.Locking, [status])
  return (
    <Grid justifyContent="space-between" gridTemplateColumns={staking ? '1fr' : ['4fr 1fr', '4fr 1fr', '1fr']}>
      <DescriptionContent fullSize={staking}>
        <Text color="textSubtle" lineHeight="120%">
          {t(
            'Enjoy the benefits of weekly CAKE yield, revenue share, gauges voting, farm yield boosting, participating in IFOs, and so much more!',
          )}
        </Text>
      </DescriptionContent>
      {isMobile && !staking ? <MobileHeadBunny /> : null}
    </Grid>
  )
}
