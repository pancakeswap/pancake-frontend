import styled from 'styled-components'
import { useMemo } from 'react'
import { Flex, Text, Skeleton } from '@pancakeswap/uikit'
import BigNumber from 'bignumber.js'
import { format } from 'date-fns'
import { useTranslation } from 'contexts/Localization'
import { Ifo, PoolIds } from 'config/constants/types'
import { PublicIfoData, WalletIfoData } from 'views/Ifos/types'
import { getBalanceNumber, formatNumber } from 'utils/formatBalance'

const StyledIfoVestingFooter = styled(Flex)`
  padding: 16px;
  margin: 0 -12px -12px;
  background-color: ${({ theme }) => theme.colors.background};
`

export interface FooterEntryProps {
  label: string
  value: string
}

const FooterEntry: React.FC<FooterEntryProps> = ({ label, value }) => {
  return (
    <Flex justifyContent="space-between" alignItems="center">
      <Text bold fontSize="12px" color="textSubtle" textTransform="uppercase">
        {label}
      </Text>
      {value ? (
        <Text bold small textAlign="right">
          {value}
        </Text>
      ) : (
        <Skeleton height={21} width={80} />
      )}
    </Flex>
  )
}

interface IfoVestingFooterProps {
  ifo: Ifo
  poolId: PoolIds
  publicIfoData: PublicIfoData
  walletIfoData: WalletIfoData
}

const IfoVestingFooter: React.FC<IfoVestingFooterProps> = ({ ifo, poolId, publicIfoData, walletIfoData }) => {
  const { t } = useTranslation()
  const { token } = ifo
  const { vestingInfomation } = publicIfoData[poolId]
  const { vestingAmountTotal } = walletIfoData[poolId]

  const releaseRate = useMemo(() => {
    const rate = new BigNumber(vestingAmountTotal).div(vestingInfomation.duration)
    const rateToNumber = getBalanceNumber(rate, token.decimals)
    return formatNumber(rateToNumber, 5, 5)
  }, [vestingInfomation, vestingAmountTotal, token])

  const releaseDate = useMemo(() => {
    const currentTimeStamp = new Date().getTime()
    const date =
      publicIfoData.vestingStartTime === 0
        ? currentTimeStamp
        : (publicIfoData.vestingStartTime + vestingInfomation.duration) * 1000
    return format(date, 'MM/dd/yyyy HH:mm')
  }, [publicIfoData, vestingInfomation])

  return (
    <StyledIfoVestingFooter flexDirection="column">
      <FooterEntry label={t('Release rate')} value={t('%releaseRate% per second', { releaseRate })} />
      <FooterEntry label={t('Fully released date')} value={releaseDate} />
    </StyledIfoVestingFooter>
  )
}

export default IfoVestingFooter
