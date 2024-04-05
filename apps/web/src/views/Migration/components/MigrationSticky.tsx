import { Trans, useTranslation } from '@pancakeswap/localization'
import { Button, Text, useMatchBreakpoints } from '@pancakeswap/uikit'
import ConnectWalletButton from 'components/ConnectWalletButton'
import React from 'react'
import { styled } from 'styled-components'
import { useAccount } from 'wagmi'

const Container = styled.div`
  position: sticky;
  bottom: calc(50px + env(safe-area-inset-bottom));
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  margin: auto;
  padding: 16px;
  z-index: 6;

  ${({ theme }) => theme.mediaQueries.sm} {
    bottom: env(safe-area-inset-bottom);
  }

  ${({ theme }) => theme.mediaQueries.xxl} {
    width: 1120px;
    padding: 24px 40px;
  }

  border-top: 1px ${({ theme }) => theme.colors.secondary} solid;
  border-left: 1px ${({ theme }) => theme.colors.secondary} solid;
  border-right: 1px ${({ theme }) => theme.colors.secondary} solid;
  border-radius: ${({ theme }) => `${theme.radii.card} ${theme.radii.card}`} 0 0;
  background: ${({ theme }) =>
    theme.isDark
      ? 'linear-gradient(360deg, rgba(61, 42, 84, 0.9) 0%, rgba(49, 61, 92, 0.9) 100%)'
      : 'linear-gradient(180deg, rgba(206, 236, 243, 0.9) 0%,  rgba(204, 220, 239, 0.9) 51.04%, rgba(202, 194, 236, 0.9) 100%)'};
`

const TextGroup = styled.div`
  display: flex;
  flex-direction: column;
  margin-right: 16px;
`

const TextTitle = styled(Text)`
  font-size: 16px;
  ${({ theme }) => theme.mediaQueries.sm} {
    font-size: 20px;
  }
  ${({ theme }) => theme.mediaQueries.lg} {
    font-size: 40px;
  }
`

const TextSubTitle = styled(Text)`
  font-size: 12px;
  ${({ theme }) => theme.mediaQueries.lg} {
    font-size: 16px;
  }
`

interface MigrationStickyProps {
  step: number
  handleClick: () => void
  version: 'v2' | 'v3' | 'bCake'
}

export const TEXT = {
  v2: {
    title: <Trans>MasterChef v2 Migration</Trans>,
    steps: [
      {
        title: <Trans>Unstaking LP Tokens and CAKE</Trans>,
        subTitle: <Trans>All the earned CAKE will be harvested to your wallet upon unstake.</Trans>,
        button: <Trans>Go to Stake</Trans>,
      },
      {
        title: <Trans>Stake in the new contract.</Trans>,
        subTitle: <Trans>Each farm and pool has to be individually enabled before staking.</Trans>,
        button: <Trans>Skip</Trans>,
      },
    ],
  },
  v3: {
    title: <Trans>PancakeSwap v3 Migration</Trans>,
    steps: [
      {
        title: <Trans>Unstaking from V2 Farms</Trans>,
        subTitle: <Trans>All the earned CAKE will be harvested to your wallet upon unstake.</Trans>,
        button: <Trans>Next Steps</Trans>,
      },
      {
        title: <Trans>Removing V2 liquidity</Trans>,
        subTitle: <Trans>All trading fee earnings are included in the tokens returned.</Trans>,
        button: <Trans>Next Steps</Trans>,
      },
      {
        title: <Trans>Learn more about V3</Trans>,
        subTitle: (
          <Trans>
            Before you provide liquidity, please read make sure you are familiar with how to provide liquidity in V3.
          </Trans>
        ),
        button: <Trans>Next Steps</Trans>,
      },
      {
        title: <Trans>Adding V3 Liquidity</Trans>,
        subTitle: <Trans>All trading fee earnings are included in the tokens returned.</Trans>,
        button: <Trans>Next Steps</Trans>,
      },
      {
        title: <Trans>Staking to V3 Farms</Trans>,
        subTitle: <Trans>Start earning CAKE by staking your liquidity positions to V3 Farms!</Trans>,
        button: <Trans>Finish</Trans>,
      },
    ],
  },
  bCake: {
    title: <Trans>PancakeSwap bCake Migration</Trans>,
    steps: [
      {
        title: <Trans>Unstaking LP tokens from the old Farms and Position Managers</Trans>,
        subTitle: <Trans>All the earned CAKE will be harvested to your wallet upon unstake.</Trans>,
        button: <Trans>Next Steps</Trans>,
      },
      {
        title: <Trans>Restake LP tokens to the new Farms and Position Managers</Trans>,
        subTitle: <Trans>All trading fee earnings are included in the tokens returned.</Trans>,
        button: <Trans>Finish</Trans>,
      },
    ],
  },
} as const

const MigrationSticky: React.FC<React.PropsWithChildren<MigrationStickyProps>> = ({ step, handleClick, version }) => {
  const { t } = useTranslation()
  const { address: account } = useAccount()
  const { isMobile } = useMatchBreakpoints()

  if (!account) {
    return (
      <Container>
        <TextGroup>
          <TextTitle bold>{TEXT[version].title}</TextTitle>
          <TextSubTitle>{t('Please connect wallet to check your pools & farms status.')}</TextSubTitle>
        </TextGroup>
        <ConnectWalletButton width={isMobile ? '131px' : '178px'} />
      </Container>
    )
  }

  return (
    <Container>
      <TextGroup>
        <TextTitle bold>{TEXT[version].steps[step]?.title}</TextTitle>
        <TextSubTitle>{TEXT[version].steps[step]?.subTitle}</TextSubTitle>
      </TextGroup>
      <Button minWidth={isMobile ? '145px' : '178px'} onClick={handleClick}>
        {TEXT[version].steps[step]?.button}
      </Button>
    </Container>
  )
}

export default MigrationSticky
