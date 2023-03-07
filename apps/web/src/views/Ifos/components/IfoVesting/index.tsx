import { useMemo, useState, useCallback, useEffect } from 'react'
import styled from 'styled-components'
import { useTranslation } from '@pancakeswap/localization'
import Trans from 'components/Trans'
import { Box, Card, CardBody, CardHeader, Flex, Text, Image, Pool, IfoNotTokens } from '@pancakeswap/uikit'
import { useAccount } from 'wagmi'
import { Token } from '@pancakeswap/sdk'
import { VestingStatus } from './types'
import TokenInfo from './VestingPeriod/TokenInfo'
import VestingEnded from './VestingEnded'
import useFetchVestingData from '../../hooks/vesting/useFetchVestingData'

const StyleVestingCard = styled(Card)`
  width: 100%;
  max-width: 400px;
  margin: 24px 0 0 0;
  align-self: baseline;
  ${({ theme }) => theme.mediaQueries.xl} {
    max-width: 350px;
    margin: -22px 12px 0 12px;
  }
`

const VestingCardBody = styled(CardBody)`
  position: relative;
  z-index: 2;
  overflow-y: auto;
  max-height: 570px;
  padding-bottom: 0;
  border-radius: 0 0 24px 24px;
`

const TokenInfoContainer = styled.div`
  > div {
    margin-bottom: 20px;
  }

  > :last-child {
    margin-bottom: 0px;
  }
`

const IfoVestingStatus = {
  [VestingStatus.NOT_TOKENS_CLAIM]: {
    status: VestingStatus.NOT_TOKENS_CLAIM,
    text: <Trans>You have no tokens available for claiming</Trans>,
    imgUrl: '/images/ifos/vesting/not-tokens.svg',
  },
  [VestingStatus.HAS_TOKENS_CLAIM]: {
    status: VestingStatus.HAS_TOKENS_CLAIM,
    text: <Trans>You have tokens available for claiming now!</Trans>,
    imgUrl: '/images/ifos/vesting/in-vesting-period.svg',
  },
  [VestingStatus.ENDED]: {
    status: VestingStatus.ENDED,
    text: <Trans>No vesting token to claim.</Trans>,
    imgUrl: '/images/ifos/vesting/in-vesting-end.svg',
  },
}

interface IfoVestingProps {
  pool: Pool.DeserializedPool<Token>
}

const IfoVesting: React.FC<React.PropsWithChildren<IfoVestingProps>> = () => {
  const { t } = useTranslation()
  const { address: account } = useAccount()
  const [isFirstTime, setIsFirstTime] = useState(true)
  const { data, fetchUserVestingData } = useFetchVestingData()

  useEffect(() => {
    // When switch account need init
    if (account) {
      setIsFirstTime(true)
      fetchUserVestingData()
    }
  }, [account, fetchUserVestingData, setIsFirstTime])

  const cardStatus = useMemo(() => {
    if (account) {
      if (data.length > 0) return IfoVestingStatus[VestingStatus.HAS_TOKENS_CLAIM]
      if (data.length === 0 && !isFirstTime) return IfoVestingStatus[VestingStatus.ENDED]
    }
    return IfoVestingStatus[VestingStatus.NOT_TOKENS_CLAIM]
  }, [data, account, isFirstTime])

  const handleFetchUserVesting = useCallback(() => {
    setIsFirstTime(false)
    fetchUserVestingData()
  }, [fetchUserVestingData])

  return (
    <StyleVestingCard isActive>
      <CardHeader p="16px">
        <Flex justifyContent="space-between" alignItems="center">
          <Box ml="8px">
            <Text fontSize="24px" color="secondary" bold>
              {t('Token Vesting')}
            </Text>
            <Text color="textSubtle" fontSize="14px">
              {cardStatus.text}
            </Text>
          </Box>
          <Image
            ml="8px"
            width={64}
            height={64}
            alt="ifo-vesting-status"
            style={{ minWidth: '64px' }}
            src={cardStatus.imgUrl}
          />
        </Flex>
      </CardHeader>
      <VestingCardBody>
        {cardStatus.status === VestingStatus.NOT_TOKENS_CLAIM && (
          <IfoNotTokens
            participateText={t(
              'Participate in our next IFO. and remember to lock your CAKE to increase your allocation!',
            )}
          />
        )}
        {cardStatus.status === VestingStatus.HAS_TOKENS_CLAIM && (
          <TokenInfoContainer>
            {data.map((ifo, index) => (
              <TokenInfo key={ifo.ifo.id} index={index} data={ifo} fetchUserVestingData={handleFetchUserVesting} />
            ))}
          </TokenInfoContainer>
        )}
        {cardStatus.status === VestingStatus.ENDED && <VestingEnded />}
      </VestingCardBody>
    </StyleVestingCard>
  )
}

export default IfoVesting
