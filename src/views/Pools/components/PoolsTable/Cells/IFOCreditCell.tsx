import { Box, Flex, HelpIcon, Skeleton, Text, useMatchBreakpoints, useTooltip } from '@pancakeswap/uikit'
import Balance from 'components/Balance'
import { useTranslation } from 'contexts/Localization'
import { useBUSDCakeAmount } from 'hooks/useBUSDPrice'

import { VaultKey } from 'state/types'
import { useIfoPoolCredit, useVaultPoolByKey } from 'state/pools/hooks'
import styled from 'styled-components'
import { getBalanceNumber } from 'utils/formatBalance'
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

const HelpIconWrapper = styled.div`
  align-self: center;
`

const IFOCreditCell: React.FC<IFOCreditCellProps> = ({ account }) => {
  const { t } = useTranslation()
  const { isMobile } = useMatchBreakpoints()
  const {
    userData: { isLoading: userDataLoading },
  } = useVaultPoolByKey(VaultKey.IfoPool)
  const credit = useIfoPoolCredit()

  const hasCredit = credit.gt(0)

  const cakeAsNumberBalance = getBalanceNumber(credit)
  const avgBalanceDollarValue = useBUSDCakeAmount(cakeAsNumberBalance)

  const labelText = t('IFO Credit')

  const { targetRef, tooltip, tooltipVisible } = useTooltip(
    <>
      <Text>
        {t(
          'Your entry limit in the next IFO Public Sale is determined by your IFO credit. This is calculated by the average CAKE balance of the principal amount in the IFO pool during the last credit calculation period.',
        )}
      </Text>
      <Text>
        {t(
          'Please note: even the pool is auto compounding. Amount of profits will not be included during IFO credit calculations.',
        )}
      </Text>
    </>,
    { placement: 'bottom' },
  )

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
            {tooltipVisible && tooltip}
            <Flex>
              <Box mr="8px" height="32px">
                <Balance
                  mt="4px"
                  bold={!isMobile}
                  fontSize={isMobile ? '14px' : '16px'}
                  color={hasCredit ? 'primary' : 'textDisabled'}
                  decimals={hasCredit ? 5 : 1}
                  value={hasCredit ? cakeAsNumberBalance : 0}
                />
                {hasCredit ? (
                  <Balance
                    display="inline"
                    fontSize="12px"
                    color="textSubtle"
                    decimals={2}
                    prefix="~"
                    value={avgBalanceDollarValue || 0}
                    unit=" USD"
                  />
                ) : (
                  <Text mt="4px" fontSize="12px" color="textDisabled">
                    0 USD
                  </Text>
                )}
              </Box>
              {hasCredit && !isMobile && (
                <HelpIconWrapper ref={targetRef}>
                  <HelpIcon color="textSubtle" />
                </HelpIconWrapper>
              )}
            </Flex>
          </>
        )}
      </CellContent>
    </StyledCell>
  )
}

export default IFOCreditCell
