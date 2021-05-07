import React, { useState } from 'react'
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
  CrownIcon,
  Tab,
  TabMenu,
  Text,
  TeamPlayerIcon,
  TrophyGoldIcon,
} from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import easterPrizes, { Tiers, Rank } from 'config/constants/trading-competition/easter'
import { Td, BoldTd, StyledPrizeTable } from '../../StyledPrizeTable'

const COLOR_GOLD = '#FFBF33'
const COLOR_SILVER = '#C1C1C1'
const COLOR_BRONZE = '#E79559'
const COLOR_PURPLE = '#A57CFD'
const COLOR_TEAL = '#4CD2DD'

const tierStyleMap = {
  [Tiers.GOLD]: {
    icon: MedalGoldIcon,
    label: {
      text: 'Gold',
    },
    color: COLOR_GOLD,
  },
  [Tiers.SILVER]: {
    icon: MedalSilverIcon,
    label: {
      text: 'Silver',
    },
    color: COLOR_SILVER,
  },
  [Tiers.BRONZE]: {
    icon: MedalBronzeIcon,
    label: {
      text: 'Bronze',
    },
    color: COLOR_BRONZE,
  },
  [Tiers.SILVER]: {
    icon: MedalSilverIcon,
    label: {
      text: 'Silver',
    },
    color: COLOR_SILVER,
  },
  [Tiers.PURPLE]: {
    icon: MedalPurpleIcon,
    label: {
      text: 'Purple',
    },
    color: COLOR_PURPLE,
  },
  [Tiers.TEAL]: {
    icon: MedalTealIcon,
    label: {
      text: 'Teal',
    },
    color: COLOR_TEAL,
  },
}

const getTotalAchievementPoints = (achievements: Rank['achievements']) => {
  return Object.values(achievements).reduce((accum, achievement) => {
    return achievement ? accum + achievement : accum
  }, 0)
}

const PrizesGrid = () => {
  const [tab, setTab] = useState(0)
  const { t } = useTranslation()
  const rows = easterPrizes[tab + 1]

  const handleItemClick = (index: number) => setTab(index)

  return (
    <Box pt="24px">
      <TabMenu activeIndex={tab} onItemClick={handleItemClick}>
        {Object.keys(easterPrizes).map((team) => {
          return <Tab key={team}>{t(`#${team} Team`, { num: team })}</Tab>
        })}
      </TabMenu>
      <Box minWidth="288px" overflowX="auto" maxWidth="100%">
        <StyledPrizeTable>
          <thead>
            <tr>
              <th>{t('Rank in team')}</th>
              <th>{t('Tier')}</th>
              <th>{t('CAKE Prizes (Split)')}</th>
              <th>{t('Achievements')}</th>
              <th>{t('NFT')}</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => {
              const { icon: Icon, label, color } = tierStyleMap[row.tier]
              const { champion, teamPlayer } = row.achievements

              return (
                <tr key={row.rank}>
                  <BoldTd>{row.rank}</BoldTd>
                  <Td>
                    <Icon />
                    <Text color={color} fontSize="12px" bold textTransform="uppercase">
                      {t(label.text)}
                    </Text>
                  </Td>
                  <BoldTd>
                    {`$${row.cakePrizeInUsd.toLocaleString(undefined, {
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 0,
                    })}`}
                  </BoldTd>
                  <Td>
                    <Flex alignItems="center" flexWrap="wrap" justifyContent="center" width="100%">
                      {champion && <CrownIcon mr={[0, '4px']} />}
                      {teamPlayer && <TeamPlayerIcon mr={[0, '4px']} />}
                      <TrophyGoldIcon mr={[0, '4px']} />
                      <Text fontSize="12px" color="textSubtle">
                        {`+${getTotalAchievementPoints(row.achievements).toLocaleString(undefined, {
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
