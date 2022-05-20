import styled from 'styled-components'
import { useTranslation } from 'contexts/Localization'
// import Trans from 'components/Trans'
// import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { DeserializedPool } from 'state/types'
import { Box, Card, CardBody, CardHeader, Flex, Text, Image } from '@pancakeswap/uikit'
// import { VestingStatus } from './types'
import NotTokens from './NotTokens'
// import VestingPeriod from './VestingPeriod/index'
// import VestingEnded from './VestingEnded'

const StyleVertingCard = styled(Card)`
  width: 100%;
  max-width: 400px;
  margin: 24px 0 0 0;
  align-self: baseline;
  ${({ theme }) => theme.mediaQueries.md} {
    max-width: 350px;
    margin: -22px 12px 0 12px;
  }
`

// const IfoVestingStatus = {
//   [VestingStatus.NOT_VESTING_TOKENS]: {
//     text: <Trans>You have no tokens available for claiming</Trans>,
//     imgUrl: '/images/ifos/vesting/not-tokens.svg',
//   },
//   [VestingStatus.IN_VESTING_PERIOD]: {
//     text: <Trans>You have tokens available for claiming now!</Trans>,
//     imgUrl: '/images/ifos/vesting/in-vesting-period.svg',
//   },
//   [VestingStatus.VESTING_ENDED]: {
//     text: <Trans>No vesting token to claim.</Trans>,
//     imgUrl: '/images/ifos/vesting/in-vesting-end.svg',
//   },
// }

interface IfoVestingProps {
  pool: DeserializedPool
}

const IfoVesting: React.FC<IfoVestingProps> = () => {
  const { t } = useTranslation()
  // const { account } = useActiveWeb3React()

  return (
    <StyleVertingCard isActive>
      <CardHeader p="16px">
        <Flex justifyContent="space-between" alignItems="center">
          <Box ml="8px">
            <Text fontSize="24px" color="secondary" bold>
              {t('Token Vesting')}
            </Text>
            <Text color="textSubtle" fontSize="14px">
              {t('You have no tokens available for claiming')}
            </Text>
          </Box>
          <Image
            ml="8px"
            width={64}
            height={64}
            alt="ifo-vesting-status"
            style={{ minWidth: '64px' }}
            src="/images/ifos/vesting/not-tokens.svg"
          />
        </Flex>
      </CardHeader>
      <CardBody>
        <NotTokens />
        {/* <VestingPeriod /> */}
        {/* <VestingEnded /> */}
      </CardBody>
    </StyleVertingCard>
  )
}

export default IfoVesting
