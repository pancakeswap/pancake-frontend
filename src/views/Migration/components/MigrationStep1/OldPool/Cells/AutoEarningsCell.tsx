import React from 'react'
import styled from 'styled-components'
import { Text, Flex, Box, useMatchBreakpoints } from '@pancakeswap/uikit'
import { DeserializedPool } from 'state/types'
import Balance from 'components/Balance'
import { useVaultPoolByKey } from 'state/pools/hooks'
import { useTranslation } from 'contexts/Localization'
import { getCakeVaultEarnings } from 'views/Pools/helpers'
import BaseCell, { CellContent } from 'views/Pools/components/PoolsTable/Cells/BaseCell'

interface AutoEarningsCellProps {
  pool: DeserializedPool
  account: string
}

const StyledCell = styled(BaseCell)`
  flex: 2 0 100px;
`

const AutoEarningsCell: React.FC<AutoEarningsCellProps> = ({ pool, account }) => {
  const { t } = useTranslation()
  const { isMobile } = useMatchBreakpoints()
  const { earningTokenPrice } = pool

  const {
    userData: { cakeAtLastUserAction, userShares },
    pricePerFullShare,
  } = useVaultPoolByKey(pool.vaultKey)
  const { hasAutoEarnings, autoCakeToDisplay } = getCakeVaultEarnings(
    account,
    cakeAtLastUserAction,
    userShares,
    pricePerFullShare,
    earningTokenPrice,
  )

  const labelText = t('Recent CAKE profit')
  const earningTokenBalance = autoCakeToDisplay
  const hasEarnings = hasAutoEarnings

  return (
    <StyledCell role="cell">
      <CellContent>
        <Text fontSize="12px" color="textSubtle" textAlign="left">
          {labelText}
        </Text>
        <Flex>
          <Box mr="8px" height="32px">
            <Balance
              mt="4px"
              fontSize={isMobile ? '14px' : '16px'}
              color={hasEarnings ? 'text' : 'textDisabled'}
              decimals={hasEarnings ? 5 : 1}
              value={hasEarnings ? earningTokenBalance : 0}
            />
          </Box>
        </Flex>
      </CellContent>
    </StyledCell>
  )
}

export default AutoEarningsCell
