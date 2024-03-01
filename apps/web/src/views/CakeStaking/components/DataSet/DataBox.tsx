import { useTranslation } from '@pancakeswap/localization'
import { AutoRow, Flex, FlexGap, Text } from '@pancakeswap/uikit'
import BigNumber from 'bignumber.js'
import styled from 'styled-components'

export const DataBox = styled(AutoRow)<{ $hideStyle?: boolean }>`
  width: 100%;
  padding: 12px;
  border-radius: ${({ theme }) => theme.radii.default};
  border: 1px solid ${({ theme, $hideStyle }) => ($hideStyle ? 'initial' : theme.colors.cardBorder)};
  background-color: ${({ theme, $hideStyle }) => ($hideStyle ? 'initial' : theme.colors.background)};
`

export const DataRow: React.FC<{
  label?: React.ReactNode
  value?: React.ReactNode
}> = ({ label, value }) => {
  return (
    <Flex justifyContent="space-between" width="100%" alignItems="center">
      <Text fontSize={12} bold color="textSubtle" textTransform="uppercase">
        {label}
      </Text>
      <Text fontSize={16} textAlign="right">
        {value}
      </Text>
    </Flex>
  )
}

export const DataHeader: React.FC<{
  value?: BigNumber
  hideVeCakeIcon?: boolean
}> = ({ value, hideVeCakeIcon }) => {
  const { t } = useTranslation()

  return (
    <DataRow
      label={
        !hideVeCakeIcon ? (
          <FlexGap gap="4px">
            <img src="/images/cake-staking/token-vecake.png" alt="token-vecake" width="24px" />
            <Text fontSize="14px" bold>
              {t('veCAKE')}
            </Text>
          </FlexGap>
        ) : (
          t('veCAKE')
        )
      }
      value={
        <Text fontSize="16px" bold={!hideVeCakeIcon}>
          {value?.lt(0.1) ? value.sd(2).toString() : value?.toFixed(2)}
        </Text>
      }
    />
  )
}
