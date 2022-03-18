import { useMemo } from 'react'
import { Card, Text, Button, BunnyPlaceholderIcon, Box } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import styled from 'styled-components'
import ConnectWalletButton from 'components/ConnectWalletButton'
import { useWeb3React } from '@web3-react/core'
import { PoolIds } from 'config/constants/types'

import { MessageTextLink, CardsWrapper } from './IfoCardStyles'
import { StyledCardBody } from './IfoFoldableCard/index'
import { cardConfig } from './IfoFoldableCard/IfoPoolCard'
import GenericIfoCard from './IfoFoldableCard/GenericIfoCard'
import StakeVaultButton from './IfoFoldableCard/StakeVaultButton'
import BunnyKnownPlaceholder from './IfoFoldableCard/IfoPoolCard/Icons/BunnyKnownPlaceholder'

const CurveBox = styled(Box)`
  border-bottom-left-radius: 100% 40px;
  border-bottom-right-radius: 100% 40px;
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center center;
`

export default function ComingSoonSection() {
  const { t } = useTranslation()
  const { account } = useWeb3React()

  const basicConfig = useMemo(
    () =>
      cardConfig(t, PoolIds.poolBasic, {
        version: 3.1,
      }),
    [t],
  )

  const unlimitedConfig = useMemo(
    () =>
      cardConfig(t, PoolIds.poolUnlimited, {
        version: 3.1,
      }),
    [t],
  )

  return (
    <Card
      background="bubblegum"
      style={{
        width: '100%',
      }}
    >
      <CurveBox
        height={[100, 110, 160, 160]}
        backgroundImage={[
          "url('/images/ifos/assets/ifo-coming-soon.png')",
          "url('/images/ifos/assets/ifo-coming-soon.png')",
          "url('/images/ifos/assets/ifo-coming-soon-desktop.png')",
          "url('/images/ifos/assets/ifo-coming-soon-desktop.png')",
        ]}
      />
      <StyledCardBody>
        <CardsWrapper>
          <GenericIfoCard
            title={unlimitedConfig?.title}
            variant={unlimitedConfig?.variant}
            tooltip={unlimitedConfig?.tooltip}
            content={
              <>
                <BunnyKnownPlaceholder width={80} mb="16px" />
                <Text textAlign="center" fontWeight={600}>
                  {t('To participate in the next IFO, stake some CAKE in the IFO CAKE pool!')}
                </Text>
                <MessageTextLink href="/ifo#ifo-how-to" color="primary" display="inline">
                  {t('How does it work?')} »
                </MessageTextLink>
              </>
            }
            action={account ? <StakeVaultButton width="100%" /> : <ConnectWalletButton width="100%" />}
          />
          <GenericIfoCard
            title={basicConfig?.title}
            variant={basicConfig?.variant}
            tooltip={basicConfig?.tooltip}
            content={
              <>
                <BunnyPlaceholderIcon width={80} mb="16px" />
                <Text textAlign="center" fontWeight={600}>
                  {t('Follow our social channels to learn more about the Next IFO Private Sale')}
                </Text>
              </>
            }
            action={
              <Button
                width="100%"
                as="a"
                href="https://medium.com/pancakeswap/initial-farm-offering-ifo-3-1-4b2cb637e8c6"
                target="_blank"
              >
                {t('Learn More about IFO 3.1')}
              </Button>
            }
          />
        </CardsWrapper>
      </StyledCardBody>
    </Card>
  )
}
