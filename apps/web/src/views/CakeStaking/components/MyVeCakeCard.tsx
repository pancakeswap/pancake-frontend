import { useTranslation } from '@pancakeswap/localization'
import { AutoColumn, Box, Text } from '@pancakeswap/uikit'
import styled from 'styled-components'

const StyledBox = styled(Box)`
  border-radius: 16px;
  background: linear-gradient(229deg, #1fc7d4 -13.69%, #7645d9 91.33%);
  padding: 16px 24px;
  display: flex;
  flex-direction: row;
`

export const MyVeCakeCard = () => {
  const { t } = useTranslation()

  return (
    <StyledBox>
      <img src="/images/cake-staking/token-vecake.png" alt="token-vecake" width="58px" />
      <AutoColumn gap="2px" ml="6px">
        <Text fontSize="12px" bold color="white" lineHeight="120%">
          {t('MY veCAKE')}
        </Text>
        <Text fontSize="24px" bold color="white" lineHeight="110%">
          1001.00
        </Text>
      </AutoColumn>
    </StyledBox>
  )
}
