import { useTranslation } from '@pancakeswap/localization'
import { Text, Box, Flex, Balance } from '@pancakeswap/uikit'
import { getBalanceNumber } from '@pancakeswap/utils/formatBalance'
import { useVeCakeBalance } from 'hooks/useTokenBalance'
import styled from 'styled-components'

const StyledBox = styled(Box)`
  border-radius: 16px;
  background: ${({ theme }) => theme.card.cardHeaderBackground.default};
  padding: 18px;
  display: flex;
  align-items: center;
  flex-direction: row;
`

export const MyVeCakeBalance = () => {
  const { t } = useTranslation()
  const { balance } = useVeCakeBalance()

  return (
    <StyledBox>
      <img src="/images/cake-staking/token-vecake.png" alt="token-vecake" width="58px" />
      <Flex flexDirection={['column', 'column', 'row']} ml="4px">
        <Text fontSize="20px" bold lineHeight="120%" mr="16px">
          {t('MY veCAKE')}
        </Text>
        <Balance
          fontSize="24px"
          bold
          color="secondary"
          lineHeight="110%"
          value={getBalanceNumber(balance)}
          decimals={2}
        />
      </Flex>
    </StyledBox>
  )
}
