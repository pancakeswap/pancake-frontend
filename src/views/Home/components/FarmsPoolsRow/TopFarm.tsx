import React from 'react'
import styled from 'styled-components'
import { Flex, Skeleton, Text } from '@pancakeswap/uikit'
import { FarmWithStakedValue } from 'views/Farms/components/FarmCard/FarmCard'
import Balance from 'components/Balance'
import { useTranslation } from 'contexts/Localization'

interface TopFarmProps {
  farm: FarmWithStakedValue
  index: number
  visible: boolean
}

const StyledWrapper = styled(Flex)<{ index: number }>`
  position: relative;
  flex-direction: column;
  height: 67px;

  ${({ index, theme }) =>
    index > 0
      ? `
         ${theme.mediaQueries.sm} {
           padding: 0 16px;
           border-left: 1px ${theme.colors.inputSecondary} solid;
         }
       `
      : ``}
`

const AbsoluteWrapper = styled.div<{ visible: boolean; index: number }>`
  position: absolute;
  top: 0;
  left: ${({ index }) => (index > 0 ? '16px' : 0)};
  opacity: ${({ visible }) => (visible ? 1 : 0)};
  margin-top: ${({ visible }) => (visible ? 0 : `50%`)};
  transition: opacity, margin-top, 0.4s ease-out;
`

const TopFarm: React.FC<TopFarmProps> = ({ farm, index, visible }) => {
  const { t } = useTranslation()

  return (
    <StyledWrapper index={index}>
      <AbsoluteWrapper index={index} visible={visible}>
        {farm?.lpSymbol ? (
          <Text bold mb="8px" fontSize="12px" color="secondary">
            {farm.lpSymbol}
          </Text>
        ) : (
          <Skeleton width={80} height={12} mb="8px" />
        )}
        {farm?.apr ? (
          <Balance lineHeight="1.1" fontSize="16px" bold unit="%" value={farm.apr + farm.lpRewardsApr} />
        ) : (
          <Skeleton width={60} height={16} />
        )}
        {farm?.apr ? (
          <Text fontSize="16px" color="textSubtle">
            {t('APR')}
          </Text>
        ) : (
          <Skeleton width={30} height={16} mt="4px" />
        )}
      </AbsoluteWrapper>
    </StyledWrapper>
  )
}

export default TopFarm
