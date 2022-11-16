import React from 'react'
import styled from 'styled-components'
import { useTranslation } from '@pancakeswap/localization'
import { Flex, Text, HelpIcon, useTooltip, Pool } from '@pancakeswap/uikit'

const StyledCell = styled(Pool.BaseCell)`
  display: none;
  flex: 1 0 100px;
  ${({ theme }) => theme.mediaQueries.md} {
    display: flex;
  }
`

const ReferenceElement = styled.div`
  display: inline-block;
`

const MultiplierWrapper = styled.div`
  color: ${({ theme }) => theme.colors.text};
  width: 36px;
  text-align: right;
  margin-right: 14px;

  ${({ theme }) => theme.mediaQueries.lg} {
    text-align: left;
    margin-right: 0;
  }
`

export interface MultiplierProps {
  multiplier: string
}

const Multiplier: React.FC<React.PropsWithChildren<MultiplierProps>> = ({ multiplier }) => {
  const displayMultiplier = multiplier ? multiplier.toLowerCase() : `0x`
  const { t } = useTranslation()
  const tooltipContent = (
    <>
      <Text>
        {t(
          'The Multiplier represents the proportion of CAKE rewards each farm receives, as a proportion of the CAKE produced each block.',
        )}
      </Text>
      <Text my="24px">
        {t('For example, if a 1x farm received 1 CAKE per block, a 40x farm would receive 40 CAKE per block.')}
      </Text>
      <Text>{t('This amount is already included in all APR calculations for the farm.')}</Text>
    </>
  )
  const { targetRef, tooltip, tooltipVisible } = useTooltip(tooltipContent, {
    placement: 'top-end',
    tooltipOffset: [20, 10],
  })

  return (
    <StyledCell role="cell">
      <Pool.CellContent>
        <Text fontSize="12px" color="textSubtle" textAlign="left">
          {t('Multiplier')}
        </Text>
        <Flex mt="4px">
          <MultiplierWrapper>{displayMultiplier}</MultiplierWrapper>
          <ReferenceElement ref={targetRef}>
            <HelpIcon color="textSubtle" />
          </ReferenceElement>
          {tooltipVisible && tooltip}
        </Flex>
      </Pool.CellContent>
    </StyledCell>
  )
}

export default Multiplier
