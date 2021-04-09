import React, { useState } from 'react'
import styled from 'styled-components'
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
} from '@pancakeswap-libs/uikit'
import useI18n from 'hooks/useI18n'
import easterPrizes, { Tiers, Rank } from 'config/constants/trading-competition/easter'

const COLOR_GOLD = '#FFBF33'
const COLOR_SILVER = '#C1C1C1'
const COLOR_BRONZE = '#E79559'
const COLOR_PURPLE = '#A57CFD'
const COLOR_TEAL = '#4CD2DD'

const tierStyleMap = {
  [Tiers.GOLD]: {
    icon: MedalGoldIcon,
    label: {
      id: 999,
      fallback: 'Gold',
    },
    color: COLOR_GOLD,
  },
  [Tiers.SILVER]: {
    icon: MedalSilverIcon,
    label: {
      id: 999,
      fallback: 'Silver',
    },
    color: COLOR_SILVER,
  },
  [Tiers.BRONZE]: {
    icon: MedalBronzeIcon,
    label: {
      id: 999,
      fallback: 'Bronze',
    },
    color: COLOR_BRONZE,
  },
  [Tiers.SILVER]: {
    icon: MedalSilverIcon,
    label: {
      id: 999,
      fallback: 'Silver',
    },
    color: COLOR_SILVER,
  },
  [Tiers.PURPLE]: {
    icon: MedalPurpleIcon,
    label: {
      id: 999,
      fallback: 'Purple',
    },
    color: COLOR_PURPLE,
  },
  [Tiers.TEAL]: {
    icon: MedalTealIcon,
    label: {
      id: 999,
      fallback: 'Teal',
    },
    color: COLOR_TEAL,
  },
}

const Td = styled.td`
  border-bottom: 2px solid ${({ theme }) => theme.colors.borderColor};
  padding: 4px 0;

  ${({ theme }) => theme.mediaQueries.sm} {
    padding: 8px;
  }
`
const BoldTd = styled(Td)`
  font-weight: 600;
`

const PrizeTable = styled.table`
  width: 100%;

  th,
  td {
    text-align: center;
    vertical-align: middle;
  }

  & > thead th {
    font-size: 12px;
    padding: 16px 0;
    text-transform: uppercase;

    ${({ theme }) => theme.mediaQueries.xs} {
      padding: 16px 8px;
    }

    ${({ theme }) => theme.mediaQueries.sm} {
      padding: 16px;
    }
  }
`

const getTotalAchievementPoints = (achievements: Rank['achievements']) => {
  return Object.values(achievements).reduce((accum, achievement) => {
    return achievement ? accum + achievement : accum
  }, 0)
}

const PrizesGrid = () => {
  const [tab, setTab] = useState(0)
  const TranslateString = useI18n()
  const rows = easterPrizes[tab + 1]

  const handleItemClick = (index: number) => setTab(index)

  return (
    <Box pt="24px">
      <TabMenu activeIndex={tab} onItemClick={handleItemClick}>
        {Object.keys(easterPrizes).map((team) => {
          return <Tab key={team}>{TranslateString(999, `#${team} Team`, { num: team })}</Tab>
        })}
      </TabMenu>
      <Box minWidth="288px" overflowX="auto" maxWidth="100%">
        <PrizeTable>
          <thead>
            <tr>
              <th>{TranslateString(1222, 'Rank in team')}</th>
              <th>{TranslateString(999, 'Tier')}</th>
              <th>{TranslateString(999, 'CAKE Prizes (Split)')}</th>
              <th>{TranslateString(1092, 'Achievements')}</th>
              <th>{TranslateString(999, 'NFT')}</th>
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
                      {TranslateString(label.id, label.fallback)}
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
        </PrizeTable>
      </Box>
    </Box>
  )
}

export default PrizesGrid
