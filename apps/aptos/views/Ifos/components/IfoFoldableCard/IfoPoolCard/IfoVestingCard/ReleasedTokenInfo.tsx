import { useMemo } from 'react'
import styled from 'styled-components'
import { Flex, Box, Text, ReleasedChart } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import BigNumber from 'bignumber.js'
import { Ifo } from 'config/constants/types'
import { getBalanceNumber, getFullDisplayBalance } from '@pancakeswap/utils/formatBalance'
import isUndefinedOrNull from '@pancakeswap/utils/isUndefinedOrNull'

const Dot = styled.div<{ isActive?: boolean }>`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  align-self: center;
  background-color: ${({ theme, isActive }) => (isActive ? theme.colors.secondary : '#d7caec')};
`

interface ReleasedTokenInfoProps {
  ifo: Ifo
  amountReleased: BigNumber
  amountInVesting: BigNumber
}

const ReleasedTokenInfo: React.FC<React.PropsWithChildren<ReleasedTokenInfoProps>> = ({
  ifo,
  amountReleased,
  amountInVesting,
}) => {
  const { t } = useTranslation()
  const { token } = ifo

  const amount = useMemo(() => {
    const released = getBalanceNumber(amountReleased, token.decimals)
    const inVesting = getBalanceNumber(amountInVesting, token.decimals)
    const total = new BigNumber(released).plus(inVesting)
    const releasedPercentage = new BigNumber(released).div(total).times(100).toFixed(2)
    const releasedPercentageDisplay = isUndefinedOrNull(releasedPercentage) ? '0' : releasedPercentage
    const inVestingPercentage = new BigNumber(inVesting).div(total).times(100).toFixed(2)
    const inVestingPercentageDisplay = isUndefinedOrNull(inVestingPercentage) ? '0' : inVestingPercentage

    return {
      released,
      releasedPercentage,
      releasedPercentageDisplay,
      inVesting,
      inVestingPercentage,
      inVestingPercentageDisplay,
    }
  }, [token, amountReleased, amountInVesting])

  return (
    <Flex mb="24px">
      <ReleasedChart percentage={Number(amount.releasedPercentage)} />
      <Flex flexDirection="column" alignSelf="center" width="100%" ml="20px">
        <Flex justifyContent="space-between" mb="7px">
          <Flex>
            <Dot isActive />
            <Text ml="4px" fontSize="14px" color="textSubtle">
              {t('Released')}
            </Text>
          </Flex>
          <Box ml="auto">
            <Text fontSize="14px" bold as="span">
              {`${getFullDisplayBalance(amountReleased, token.decimals, 4)} `}
            </Text>
            <Text fontSize="14px" as="span">
              {`(${amount.releasedPercentageDisplay}%)`}
            </Text>
          </Box>
        </Flex>
        <Flex justifyContent="space-between">
          <Flex>
            <Dot />
            <Text ml="4px" fontSize="14px" color="textSubtle">
              {t('Vested')}
            </Text>
          </Flex>
          <Box ml="auto">
            <Text fontSize="14px" bold as="span">
              {`${getFullDisplayBalance(amountInVesting, token.decimals, 4)} `}
            </Text>
            <Text fontSize="14px" as="span">
              {`(${amount.inVestingPercentageDisplay}%)`}
            </Text>
          </Box>
        </Flex>
      </Flex>
    </Flex>
  )
}

export default ReleasedTokenInfo
