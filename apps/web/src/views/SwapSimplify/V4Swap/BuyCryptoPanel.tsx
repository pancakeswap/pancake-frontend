import { useTranslation } from '@pancakeswap/localization'
import { Button, FlexGap, InfoIcon, Text } from '@pancakeswap/uikit'
import { useRouter } from 'next/router'
import { memo } from 'react'
import { styled } from 'styled-components'

export const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-radius: 20px;
  border: 1px solid ${({ theme }) => theme.colors.cardBorder};
  background: ${({ theme }) => theme.colors.card};
  padding: 12px;
  width: 100%;
`

export const BuyCryptoPanel: React.FC = memo(() => {
  const { t } = useTranslation()
  const router = useRouter()
  return (
    <Wrapper>
      <FlexGap gap="8px" alignItems="center">
        <InfoIcon color="#02919D" />
        <Text>{t('Need Crypto? Buy with the best price!')}</Text>
      </FlexGap>
      <Button
        scale="sm"
        onClick={() => {
          router.push('/buy-crypto')
        }}
      >
        {t('Get it Now')}
      </Button>
    </Wrapper>
  )
})
