import {
  BlockIcon,
  Box,
  CheckmarkCircleIcon,
  Flex,
  MedalBronzeIcon,
  MedalGoldIcon,
  MedalPurpleIcon,
  MedalSilverIcon,
  MedalTealIcon,
  Tab,
  TabMenu,
  Text,
} from '@pancakeswap/uikit'
import Image from 'next/image'
import Trans from 'components/Trans'
import { Tiers, PrizesConfig } from 'config/constants/trading-competition/prizes'
import { useTranslation } from '@pancakeswap/localization'
import { useState } from 'react'
import { BoldTd, Td, StyledPrizeTable } from '../../StyledPrizeTable'

const COLOR_GOLD = '#FFBF33'
const COLOR_SILVER = '#C1C1C1'
const COLOR_BRONZE = '#E79559'
const COLOR_PURPLE = '#A57CFD'
const COLOR_TEAL = '#4CD2DD'

const tierStyleMap = {
  [Tiers.GOLD]: {
    icon: MedalGoldIcon,
    label: {
      text: <Trans>Gold</Trans>,
    },
    color: COLOR_GOLD,
  },
  [Tiers.SILVER]: {
    icon: MedalSilverIcon,
    label: {
      text: <Trans>Silver</Trans>,
    },
    color: COLOR_SILVER,
  },
  [Tiers.BRONZE]: {
    icon: MedalBronzeIcon,
    label: {
      text: <Trans>Bronze</Trans>,
    },
    color: COLOR_BRONZE,
  },
  [Tiers.SILVER]: {
    icon: MedalSilverIcon,
    label: {
      text: <Trans>Silver</Trans>,
    },
    color: COLOR_SILVER,
  },
  [Tiers.PURPLE]: {
    icon: MedalPurpleIcon,
    label: {
      text: <Trans>Purple</Trans>,
    },
    color: COLOR_PURPLE,
  },
  [Tiers.TEAL]: {
    icon: MedalTealIcon,
    label: {
      text: <Trans>Teal</Trans>,
    },
    color: COLOR_TEAL,
  },
}

interface PrizesGridProps {
  prizesConfig: PrizesConfig
}

const PrizesGrid: React.FC<React.PropsWithChildren<PrizesGridProps>> = ({ prizesConfig }) => {
  const [tab, setTab] = useState(0)
  const { t } = useTranslation()
  const rows = prizesConfig[tab + 1]

  const handleItemClick = (index: number) => setTab(index)

  return (
    <Box pt="24px">
      <TabMenu activeIndex={tab} onItemClick={handleItemClick}>
        {Object.keys(prizesConfig).map((team) => {
          return <Tab key={team}>{t('#%team% Team', { team })}</Tab>
        })}
      </TabMenu>
      <Box minWidth="288px" overflowX="auto" maxWidth="100%">
        <StyledPrizeTable>
          <thead>
            <tr>
              <th>{t('Rank in team')}</th>
              <th>{t('Tier')}</th>
              <th>{t('Token Prizes (Split)')}</th>
              <th>{t('Achievements')}</th>
              <th>{t('NFT')}</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => {
              const { icon: Icon, label, color } = tierStyleMap[row.tier]

              return (
                <tr key={row.rank}>
                  <BoldTd>{row.rank}</BoldTd>
                  <Td>
                    <Icon />
                    <Text color={color} fontSize="12px" bold textTransform="uppercase">
                      {label.text}
                    </Text>
                  </Td>
                  <BoldTd>
                    {`$${row.tokenPrizeInUsd.toLocaleString(undefined, {
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 0,
                    })}`}
                  </BoldTd>
                  <Td>
                    <Flex alignItems="center" flexWrap="wrap" justifyContent="flex-start" width="100%">
                      <Image
                        src={`/images/achievements/${row.achievements.image}`}
                        alt={`achievement-image-${row.rank}`}
                        width={38}
                        height={38}
                      />
                      <Text ml="8px" fontSize="12px" color="textSubtle">
                        {`+${row.achievements.points.toLocaleString(undefined, {
                          minimumFractionDigits: 0,
                          maximumFractionDigits: 0,
                        })}`}
                      </Text>
                    </Flex>
                  </Td>
                  <Td>{row.hasNft ? <CheckmarkCircleIcon color="success" /> : <BlockIcon color="textDisabled" />}</Td>
                </tr>
              )
            })}
          </tbody>
        </StyledPrizeTable>
      </Box>
    </Box>
  )
}

export default PrizesGrid
