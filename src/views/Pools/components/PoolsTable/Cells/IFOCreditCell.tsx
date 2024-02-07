import { Box, Flex, Skeleton, Text, useMatchBreakpoints } from '@pancakeswap/uikit'
import Balance from 'components/Balance'
import { useTranslation } from 'contexts/Localization'

import { VaultKey } from 'state/types'
import { useVaultPoolByKey } from 'state/pools/hooks'
import styled from 'styled-components'
import BaseCell, { CellContent } from './BaseCell'

interface IFOCreditCellProps {
  account: string
}

const StyledCell = styled(BaseCell)`
  flex: 4.5;
  ${({ theme }) => theme.mediaQueries.sm} {
    flex: 1 0 120px;
  }
  ${({ theme }) => theme.mediaQueries.lg} {
    flex: 2 0 100px;
  }
`

const IFOCreditCell: React.FC<IFOCreditCellProps> = ({ account }) => {
  const { t } = useTranslation()
  const { isMobile } = useMatchBreakpoints()
  const {
    userData: { isLoading: userDataLoading },
  } = useVaultPoolByKey(VaultKey.IfoPool)

  const labelText = t('IFO Credit')

  return (
    <StyledCell role="cell">
      <CellContent>
        <Text fontSize="12px" color="textSubtle" textAlign="left">
          {labelText}
        </Text>
        {userDataLoading && account ? (
          <Skeleton width="80px" height="16px" />
        ) : (
          <>
            <Flex>
              <Box mr="8px" height="32px">
                <Balance
                  mt="4px"
                  bold={!isMobile}
                  fontSize={isMobile ? '14px' : '16px'}
                  color="textDisabled"
                  decimals={1}
                  value={0}
                />
                <Text mt="4px" fontSize="12px" color="textDisabled">
                  0 USD
                </Text>
              </Box>
            </Flex>
          </>
        )}
      </CellContent>
    </StyledCell>
  )
}

export default IFOCreditCell
