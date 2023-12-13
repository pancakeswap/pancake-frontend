import { useTranslation } from '@pancakeswap/localization'
import { AutoColumn, AutoRow, Box, Text } from '@pancakeswap/uikit'
import { formatNumber, getBalanceNumber } from '@pancakeswap/utils/formatBalance'
import { useVeCakeBalance } from 'hooks/useTokenBalance'
import styled from 'styled-components'

export const StyledBox = styled(Box)`
  border-radius: 16px;
  background: linear-gradient(229deg, #1fc7d4 -13.69%, #7645d9 91.33%);
  padding-top: 16px;
  padding-bottom: 16px;
  display: flex;
  flex-direction: row;
`

export const MyVeCakeCard: React.FC<{
  type?: 'row' | 'column'
  value?: string
}> = ({ type = 'column', value }) => {
  const { t } = useTranslation()
  const { balance } = useVeCakeBalance()

  return (
    <StyledBox px={type === 'row' ? '16px' : '24px'}>
      <img src="/images/cake-staking/token-vecake.png" alt="token-vecake" width="58px" />
      {type === 'column' ? (
        <AutoColumn gap="2px" ml="6px">
          <Text fontSize="12px" bold color="white" lineHeight="120%">
            {t('MY veCAKE')}
          </Text>
          <Text fontSize="24px" bold color="white" lineHeight="110%">
            {value ?? formatNumber(getBalanceNumber(balance))}
          </Text>
        </AutoColumn>
      ) : null}
      {type === 'row' ? (
        <AutoRow justifyContent="space-between" ml="8px">
          <Text fontSize="20px" bold color="white" lineHeight="120%">
            {t('MY veCAKE')}
          </Text>

          <Text fontSize="20px" bold color="white" lineHeight="110%">
            {value ?? formatNumber(getBalanceNumber(balance))}
          </Text>
        </AutoRow>
      ) : null}
    </StyledBox>
  )
}
