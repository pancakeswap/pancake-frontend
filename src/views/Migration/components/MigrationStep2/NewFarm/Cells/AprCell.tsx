import React from 'react'
import styled from 'styled-components'
import { Flex, Text } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import BaseCell, { CellContent } from 'views/Pools/components/PoolsTable/Cells/BaseCell'
import Apr, { AprProps } from 'views/Farms/components/FarmTable/Apr'

const StyledCell = styled(BaseCell)`
  display: none;
  flex: 2 0 100px;
  ${({ theme }) => theme.mediaQueries.md} {
    display: flex;
  }
`

const AprCell: React.FC<React.PropsWithChildren<AprProps>> = (apr) => {
  const { t } = useTranslation()

  return (
    <StyledCell role="cell">
      <CellContent>
        <Text fontSize="12px" color="textSubtle" textAlign="left">
          {t('APR')}
        </Text>
        <Flex mt="4px">
          <Apr {...apr} />
        </Flex>
      </CellContent>
    </StyledCell>
  )
}

export default AprCell
