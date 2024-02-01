import { useMemo } from 'react'
import { styled } from 'styled-components'
import { useTranslation } from '@pancakeswap/localization'
import { Flex, Text, Progress, Tag } from '@pancakeswap/uikit'
import { VestingData } from 'views/Ifos/hooks/vesting/fetchUserWalletIfoData'
import { PoolIds } from '@pancakeswap/ifos'
import { getFullDisplayBalance } from '@pancakeswap/utils/formatBalance'
import { useCurrentBlock } from 'state/block/hooks'
import useGetPublicIfoV3Data from 'views/Ifos/hooks/v3/useGetPublicIfoData'
import BigNumber from 'bignumber.js'
import dayjs from 'dayjs'

import { useQuery } from '@tanstack/react-query'
import Claim from './Claim'
import { isBasicSale } from '../../../hooks/v7/helpers'

const WhiteCard = styled.div`
  background: ${({ theme }) => theme.colors.backgroundAlt};
  padding: 12px;
  border-radius: 12px;
  margin: 8px 0 20px 0;
`

const StyleTag = styled(Tag)<{ isPrivate: boolean }>`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.text};
  background: ${({ theme, isPrivate }) => (isPrivate ? theme.colors.gradientBlue : theme.colors.gradientViolet)};
`

interface InfoProps {
  poolId: PoolIds
  data: VestingData
  fetchUserVestingData: () => void
  ifoBasicSaleType?: number
}

const Info: React.FC<React.PropsWithChildren<InfoProps>> = ({
  poolId,
  data,
  fetchUserVestingData,
  ifoBasicSaleType,
}) => {
  const { t } = useTranslation()
  const { token } = data.ifo
  const { vestingStartTime } = data.userVestingData
  const {
    isVestingInitialized,
    vestingComputeReleasableAmount,
    offeringAmountInToken,
    vestingInformationPercentage,
    vestingReleased,
    vestingInformationDuration,
  } = data.userVestingData[poolId]
  const labelText =
    poolId === PoolIds.poolUnlimited
      ? t('Public Sale')
      : isBasicSale(ifoBasicSaleType)
      ? t('Basic Sale')
      : t('Private Sale')

  const currentBlock = useCurrentBlock()
  const publicIfoData = useGetPublicIfoV3Data(data.ifo)
  const { fetchIfoData: fetchPublicIfoData, isInitialized: isPublicIfoDataInitialized } = publicIfoData
  useQuery({
    queryKey: ['fetchPublicIfoData', currentBlock, data?.ifo?.id],
    queryFn: async () => fetchPublicIfoData(currentBlock),
    enabled: Boolean(!isPublicIfoDataInitialized && currentBlock),
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
  })

  const { cliff } = publicIfoData[poolId]?.vestingInformation || {}
  const currentTimeStamp = Date.now()
  const timeCliff = vestingStartTime === 0 ? currentTimeStamp : (vestingStartTime + (cliff ?? 0)) * 1000
  const timeVestingEnd = (vestingStartTime + vestingInformationDuration) * 1000
  const isVestingOver = currentTimeStamp > timeVestingEnd

  const vestingPercentage = useMemo(
    () => new BigNumber(vestingInformationPercentage).times(0.01),
    [vestingInformationPercentage],
  )

  const releasedAtSaleEnd = useMemo(() => {
    return new BigNumber(offeringAmountInToken).times(new BigNumber(1).minus(vestingPercentage))
  }, [offeringAmountInToken, vestingPercentage])

  const amountReleased = useMemo(() => {
    return new BigNumber(releasedAtSaleEnd).plus(vestingReleased).plus(vestingComputeReleasableAmount)
  }, [releasedAtSaleEnd, vestingReleased, vestingComputeReleasableAmount])

  const received = useMemo(() => {
    const alreadyClaimed = new BigNumber(releasedAtSaleEnd).plus(vestingReleased)
    return alreadyClaimed.gt(0) ? getFullDisplayBalance(alreadyClaimed, token.decimals, 4) : '0'
  }, [token, releasedAtSaleEnd, vestingReleased])

  const claimable = useMemo(() => {
    const remain = new BigNumber(offeringAmountInToken).minus(amountReleased)
    const claimableAmount = isVestingOver ? vestingComputeReleasableAmount.plus(remain) : vestingComputeReleasableAmount
    return claimableAmount.gt(0) ? getFullDisplayBalance(claimableAmount, token.decimals, 4) : '0'
  }, [offeringAmountInToken, amountReleased, isVestingOver, vestingComputeReleasableAmount, token.decimals])

  const remaining = useMemo(() => {
    const remain = new BigNumber(offeringAmountInToken).minus(amountReleased)
    return remain.gt(0) ? getFullDisplayBalance(remain, token.decimals, 4) : '0'
  }, [token, offeringAmountInToken, amountReleased])

  const percentage = useMemo(() => {
    const total = new BigNumber(received).plus(claimable).plus(remaining)
    const receivedPercentage = new BigNumber(received).div(total).times(100).toNumber()
    const amountAvailablePercentage = new BigNumber(claimable).div(total).times(100).toNumber()
    return {
      receivedPercentage,
      amountAvailablePercentage: receivedPercentage + amountAvailablePercentage,
    }
  }, [received, claimable, remaining])

  if (claimable === '0' && remaining === '0') {
    return null
  }

  return (
    <>
      <Flex justifyContent="space-between">
        <Text style={{ alignSelf: 'center' }} fontSize="12px" bold color="secondary" textTransform="uppercase">
          {t('Vesting Schedule')}
        </Text>
        <StyleTag isPrivate={poolId === PoolIds.poolBasic}>{labelText}</StyleTag>
      </Flex>
      <Flex justifyContent="space-between" mt="8px">
        <Text style={{ alignSelf: 'center' }} fontSize="12px" bold color="secondary" textTransform="uppercase">
          {cliff === 0 ? t('Vesting Start') : t('Cliff')}
        </Text>
        <Text fontSize="12px" color="textSubtle">
          {dayjs(timeCliff).format('MM/DD/YYYY HH:mm')}
        </Text>
      </Flex>
      <Flex justifyContent="space-between">
        <Text style={{ alignSelf: 'center' }} fontSize="12px" bold color="secondary" textTransform="uppercase">
          {t('Vesting end')}
        </Text>
        <Text fontSize="12px" color="textSubtle">
          {dayjs(timeVestingEnd).format('MM/DD/YYYY HH:mm')}
        </Text>
      </Flex>
      <WhiteCard>
        <Progress primaryStep={percentage.receivedPercentage} secondaryStep={percentage.amountAvailablePercentage} />
        <Flex>
          <Flex flexDirection="column" mr="8px">
            <Text fontSize="14px">{received}</Text>
            <Text fontSize="14px" color="textSubtle">
              {t('Received')}
            </Text>
          </Flex>
          <Flex flexDirection="column">
            <Text fontSize="14px">{claimable}</Text>
            <Text fontSize="14px" color="textSubtle">
              {t('Claimable')}
            </Text>
          </Flex>
          <Flex flexDirection="column" ml="auto">
            <Text fontSize="14px" textAlign="right">
              {isVestingOver ? '-' : remaining}
            </Text>
            <Text fontSize="14px" color="textSubtle">
              {t('Remaining')}
            </Text>
          </Flex>
        </Flex>
        <Claim
          poolId={poolId}
          data={data}
          claimableAmount={claimable}
          isVestingInitialized={isVestingInitialized}
          fetchUserVestingData={fetchUserVestingData}
        />
      </WhiteCard>
    </>
  )
}

export default Info
