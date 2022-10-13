import { useMemo } from 'react'
import { Box, Card, Text } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import styled from 'styled-components'
import { PoolIds } from 'config/constants/types'

import { CardsWrapper } from './IfoCardStyles'
import { StyledCardBody } from './IfoFoldableCard'
import { cardConfig } from './IfoFoldableCard/IfoPoolCard'
import GenericIfoCard from './IfoFoldableCard/GenericIfoCard'
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

  // const basicConfig = useMemo(
  //   () =>
  //     cardConfig(t, PoolIds.poolBasic, {
  //       version: 3.1,
  //     }),
  //   [t],
  // )

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
      <CurveBox height={[100, 110, 160, 160]} backgroundImage="url('/images/ifos/assets/ifo-coming-soon.png')" />
      <StyledCardBody>
        <CardsWrapper singleCard>
          <GenericIfoCard
            title={unlimitedConfig?.title}
            variant={unlimitedConfig?.variant}
            tooltip={unlimitedConfig?.tooltip}
            content={
              <>
                <BunnyKnownPlaceholder width={80} mb="16px" />
                <Text textAlign="center" fontWeight={600}>
                  {t('Follow our social channels to learn more about the next IFO.')}
                </Text>
              </>
            }
            action={null}
          />
          {/* <GenericIfoCard
            title={basicConfig?.title}
            variant={basicConfig?.variant}
            tooltip={basicConfig?.tooltip}
            content={
              <>
                <BunnyPlaceholderIcon width={80} mb="16px" />
                <Text textAlign="center" fontWeight={600}>
                  {t('Follow our social channels to learn more about the next IFO.')}
                </Text>
              </>
            }
            action={null}
          /> */}
        </CardsWrapper>
      </StyledCardBody>
    </Card>
  )
}
