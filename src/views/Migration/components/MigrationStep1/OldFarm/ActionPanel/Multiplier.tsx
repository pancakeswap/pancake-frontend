import React from 'react'
import styled from 'styled-components'
import { useTranslation } from '@pancakeswap/localization'
import { Flex, Text, HelpIcon, useTooltip } from '@pancakeswap/uikit'
import { MultiplierProps } from '../Cells/Multiplier'

const Containter = styled(Flex)`
  margin-top: 12px;
  padding: 0;
  width: 100%;

  ${({ theme }) => theme.mediaQueries.sm} {
    padding: 0 12px;
  }
`

const ReferenceElement = styled.div`
  display: inline-block;
  align-self: center;
`

const MultiplierWrapper = styled.div`
  color: ${({ theme }) => theme.colors.text};
  width: 36px;
  margin-right: 6px;
  align-self: center;
  text-align: right;

  ${({ theme }) => theme.mediaQueries.lg} {
    margin-right: 0;
  }
`

const TotalStaked: React.FC<React.PropsWithChildren<MultiplierProps>> = ({ multiplier }) => {
  const { t } = useTranslation()
  const displayMultiplier = multiplier ? multiplier.toLowerCase() : '0x'

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
    <Containter justifyContent="space-between">
      <Text>{t('Multiplier')}</Text>
      <Flex>
        <MultiplierWrapper>{displayMultiplier}</MultiplierWrapper>
        <ReferenceElement ref={targetRef}>
          <HelpIcon color="textSubtle" />
        </ReferenceElement>
        {tooltipVisible && tooltip}
      </Flex>
    </Containter>
  )
}

export default TotalStaked
