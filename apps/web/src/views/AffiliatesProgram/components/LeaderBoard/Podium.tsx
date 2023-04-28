import { useMemo } from 'react'
import { useTranslation } from '@pancakeswap/localization'
import { Flex, Text } from '@pancakeswap/uikit'
import truncateHash from '@pancakeswap/utils/truncateHash'
import {
  RightBox,
  MiddleBox,
  LeftBox,
  Wrapper,
  Inner,
  StyledVolumeFlex,
} from 'views/TradingCompetition/components/TeamRanks/Podium/styles'
import { PodiumBase } from 'views/TradingCompetition/svgs'
import PodiumAvatar from 'views/AffiliatesProgram/components/LeaderBoard/PodiumAvatar'
import { ListType } from 'views/AffiliatesProgram/hooks/useLeaderboard'
import PodiumText from 'views/AffiliatesProgram/components/LeaderBoard/PodiumText'

interface PodiumProps {
  list: ListType[]
}

const Podium: React.FC<React.PropsWithChildren<PodiumProps>> = ({ list }) => {
  const { t } = useTranslation()
  const firstThreeData = useMemo(() => list.slice(0, 3), [list])
  const firstUser = firstThreeData && firstThreeData[0]
  const secondUser = firstThreeData && firstThreeData[1]
  const thirdUser = firstThreeData && firstThreeData[2]

  return (
    <Wrapper margin="60px auto">
      <Inner>
        <Flex height="132px" position="relative">
          <LeftBox>
            <PodiumAvatar position={2} address={secondUser?.address} />
            <Text margin="auto auto 10px auto" maxWidth="80px" color="primary" bold textAlign="center" ellipsis>
              {truncateHash(secondUser?.address)}
            </Text>
          </LeftBox>
          <MiddleBox>
            <PodiumAvatar position={1} address={firstUser?.address} />
            <Text margin="auto auto 10px auto" maxWidth="80px" color="primary" bold textAlign="center" ellipsis>
              {truncateHash(firstUser?.address)}
            </Text>
          </MiddleBox>
          <RightBox>
            <PodiumAvatar position={3} address={thirdUser?.address} />
            <Text margin="auto auto 10px auto" maxWidth="80px" color="primary" bold textAlign="center" ellipsis>
              {truncateHash(thirdUser?.address)}
            </Text>
          </RightBox>
        </Flex>
        <PodiumBase />
        <Flex justifyContent="space-between" mt="8px">
          <StyledVolumeFlex>
            <PodiumText
              title={t('Total Volume')}
              prefix="$"
              amount={secondUser?.metric?.totalTradeVolumeUSD}
              mb="12px"
            />
            <PodiumText title={t('New Users')} amount={secondUser?.metric?.totalUsers.toString()} />
            {/* <PodiumText title={t('Commission')} prefix="$" amount={secondUser?.metric?.totalEarnFeeUSD} mt="12px" /> */}
          </StyledVolumeFlex>
          <StyledVolumeFlex>
            <PodiumText
              title={t('Total Volume')}
              prefix="$"
              amount={firstUser?.metric?.totalTradeVolumeUSD}
              mb="12px"
            />
            <PodiumText title={t('New Users')} amount={firstUser?.metric?.totalUsers.toString()} />
            {/* <PodiumText title={t('Commission')} prefix="$" amount={firstUser?.metric?.totalEarnFeeUSD} mt="12px" /> */}
          </StyledVolumeFlex>
          <StyledVolumeFlex>
            <PodiumText
              title={t('Total Volume')}
              prefix="$"
              amount={thirdUser?.metric?.totalTradeVolumeUSD}
              mb="12px"
            />
            <PodiumText title={t('New Users')} amount={thirdUser?.metric?.totalUsers.toString()} />
            {/* <PodiumText title={t('Commission')} prefix="$" amount={thirdUser?.metric?.totalEarnFeeUSD} mt="12px" /> */}
          </StyledVolumeFlex>
        </Flex>
      </Inner>
    </Wrapper>
  )
}

export default Podium
