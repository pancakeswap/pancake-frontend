import React from 'react'
import styled from 'styled-components'
import { Flex, Text } from '@pancakeswap/uikit'
import { Token } from '@pancakeswap/sdk'
import { useFarmUser } from 'state/farms/hooks'
import { useTranslation } from 'contexts/Localization'
import { getBalanceNumber } from 'utils/formatBalance'
import BaseCell, { CellContent } from 'views/Pools/components/PoolsTable/Cells/BaseCell'
import { TokenPairImage } from 'components/TokenImage'

const StyledCell = styled(BaseCell)`
  flex: 0;
  margin-left: 12px;
  ${({ theme }) => theme.mediaQueries.sm} {
    flex: 1 0 150px;
    margin-left: 32px;
  }
`

const TokenWrapper = styled.div`
  padding-right: 8px;
  width: 24px;

  ${({ theme }) => theme.mediaQueries.sm} {
    width: 40px;
  }
`

export interface FarmProps {
  label: string
  pid: number
  token: Token
  quoteToken: Token
  lpSymbol: string
}

const Farm: React.FC<FarmProps> = ({ token, quoteToken, label, pid }) => {
  const { stakedBalance } = useFarmUser(pid)
  const { t } = useTranslation()
  const rawStakedBalance = getBalanceNumber(stakedBalance)

  const handleRenderFarming = (): JSX.Element => {
    if (rawStakedBalance) {
      return (
        <Text color="secondary" fontSize="12px" bold textTransform="uppercase">
          {t('Farming')}
        </Text>
      )
    }

    return null
  }

  return (
    <StyledCell role="cell">
      <CellContent>
        <Flex>
          <TokenWrapper>
            <TokenPairImage
              variant="inverted"
              primaryToken={token}
              secondaryToken={quoteToken}
              width={40}
              height={40}
            />
          </TokenWrapper>
          <Flex flexDirection="column" alignSelf="center">
            {handleRenderFarming()}
            <Text bold>{label}</Text>
          </Flex>
        </Flex>
      </CellContent>
    </StyledCell>
  )
}

export default Farm
