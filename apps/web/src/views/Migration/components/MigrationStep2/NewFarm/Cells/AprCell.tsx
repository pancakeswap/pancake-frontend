import React from 'react'
import styled from 'styled-components'
import { Flex, Text, Pool } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import Apr, { AprProps } from 'views/Farms/components/FarmTable/Apr'

const StyledCell = styled(Pool.BaseCell)`
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
      <Pool.CellContent>
        <Text fontSize="12px" color="textSubtle" textAlign="left">
          {t('APR')}
        </Text>
        <Flex mt="4px">
          <Apr {...apr} />
        </Flex>
      </Pool.CellContent>
    </StyledCell>
  )
}

export default AprCell
