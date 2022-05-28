import { useMemo } from 'react'
import { useRouter } from 'next/router'
import styled, { keyframes, css } from 'styled-components'
import { useTranslation } from 'contexts/Localization'
import { Box, Flex, Text, Progress, Button } from '@pancakeswap/uikit'
import { VestingData } from 'views/Ifos/hooks/vesting/fetchUserWalletIfoData'
import { PoolIds } from 'config/constants/types'
import { getBalanceNumber, formatNumber } from 'utils/formatBalance'
import BigNumber from 'bignumber.js'
import Claim from './Claim'

const expandAnimation = keyframes`
  from {
    opacity: 0;
    max-height: 0px;
  }
  to {
    opacity: 1;
    max-height: 200px;
  }
`

const collapseAnimation = keyframes`
  from {
    opacity: 1;
    max-height: 200px;
  }
  to {
    opacity: 0;
    max-height: 0px;
  }
`

const StyledExpand = styled(Box)<{ expanded: boolean }>`
  opacity: 1;
  animation: ${({ expanded }) =>
    expanded
      ? css`
          ${expandAnimation} 300ms linear forwards
        `
      : css`
          ${collapseAnimation} 300ms linear forwards
        `};
  overflow: hidden;
  margin: 0 -24px;
  padding: 24px;
  background: ${({ theme }) => theme.colors.dropdown};
`

interface ExpandProps {
  data: VestingData
  expanded: boolean
  fetchUserVestingData: () => void
}

const Expand: React.FC<ExpandProps> = ({ data, expanded, fetchUserVestingData }) => {
  const { t } = useTranslation()
  const router = useRouter()
  const { token } = data.ifo
  const { vestingcomputeReleasableAmount, offeringAmountInToken, vestingInfomationPercentage, vestingReleased } =
    data.userVestingData[PoolIds.poolUnlimited]

  const vestingPercentage = useMemo(
    () => new BigNumber(vestingInfomationPercentage).times(0.01),
    [vestingInfomationPercentage],
  )

  const releasedAtSaleEnd = useMemo(() => {
    return new BigNumber(offeringAmountInToken).times(new BigNumber(1).minus(vestingPercentage))
  }, [offeringAmountInToken, vestingPercentage])

  const amountReleased = useMemo(() => {
    return new BigNumber(releasedAtSaleEnd).plus(vestingReleased).plus(vestingcomputeReleasableAmount)
  }, [releasedAtSaleEnd, vestingReleased, vestingcomputeReleasableAmount])

  const received = useMemo(() => {
    const alreadyClaimed = new BigNumber(releasedAtSaleEnd).plus(vestingReleased)
    const balance = getBalanceNumber(alreadyClaimed)
    return balance > 0 ? formatNumber(balance, 4, 4) : '0'
  }, [releasedAtSaleEnd, vestingReleased])

  const claimable = useMemo(() => {
    const balance = getBalanceNumber(vestingcomputeReleasableAmount, token.decimals)
    return balance > 0 ? formatNumber(balance, 4, 4) : '0'
  }, [token, vestingcomputeReleasableAmount])

  const remaining = useMemo(() => {
    const remain = new BigNumber(offeringAmountInToken).minus(amountReleased)
    const balance = getBalanceNumber(remain, token.decimals)
    return balance > 0 ? formatNumber(balance, 4, 4) : '0'
  }, [token, offeringAmountInToken, amountReleased])

  const percentage = useMemo(() => {
    const total = new BigNumber(received).plus(claimable).plus(remaining)
    const receivedPercentage = new BigNumber(received).div(total).times(100).toNumber()
    const amountAvailablePrecentage = new BigNumber(claimable).div(total).times(100).toNumber()
    return {
      receivedPercentage,
      amountAvailablePrecentage: receivedPercentage + amountAvailablePrecentage,
    }
  }, [received, claimable, remaining])

  const handleViewIfo = () => {
    router.push(`/ifo/history#${token.symbol}`)
  }

  return (
    <StyledExpand expanded={expanded}>
      <Progress primaryStep={percentage.receivedPercentage} secondaryStep={percentage.amountAvailablePrecentage} />
      <Flex mt="8px" mb="20px">
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
            {remaining}
          </Text>
          <Text fontSize="14px" color="textSubtle">
            {t('Remaining')}
          </Text>
        </Flex>
      </Flex>
      <Flex>
        <Button mr="8px" variant="secondary" onClick={handleViewIfo}>
          {t('View IFO')}
        </Button>
        <Claim data={data} fetchUserVestingData={fetchUserVestingData} />
      </Flex>
    </StyledExpand>
  )
}

export default Expand
