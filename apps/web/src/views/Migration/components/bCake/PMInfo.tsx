import { useTranslation } from '@pancakeswap/localization'
import { MANAGER, baseManagers } from '@pancakeswap/position-managers'
import { Flex, Text } from '@pancakeswap/uikit'
import { Pool } from '@pancakeswap/widgets-internal'
import React, { useMemo } from 'react'
import { styled } from 'styled-components'

import { Token } from '@pancakeswap/sdk'
import { TokenPairImage } from 'components/TokenImage'

const StyledCell = styled(Pool.BaseCell)`
  flex: 0;
  margin-left: 12px;
  ${({ theme }) => theme.mediaQueries.sm} {
    flex: 1 0 100px;
    margin-left: 30px;
  }
`

const TokenWrapper = styled.div`
  padding-right: 8px;
  width: 32px;

  ${({ theme }) => theme.mediaQueries.sm} {
    width: 40px;
  }
`

export interface FarmProps {
  label: string
  token: Token
  quoteToken: Token
  manager: MANAGER
}

const Farm: React.FC<React.PropsWithChildren<FarmProps>> = ({ token, quoteToken, label, manager }) => {
  const managerInfo = useMemo(() => baseManagers[manager], [manager])
  const { t } = useTranslation()
  return (
    <StyledCell role="cell">
      <Pool.CellContent>
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
            <Text bold>{label}</Text>
            <Text bold fontSize="12px" color="textSubtle">
              {t('by')}
              {managerInfo.name}
            </Text>
          </Flex>
        </Flex>
      </Pool.CellContent>
    </StyledCell>
  )
}

export default Farm
