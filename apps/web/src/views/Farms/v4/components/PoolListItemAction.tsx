import { useTheme } from '@pancakeswap/hooks'
import { useTranslation } from '@pancakeswap/localization'
import { Button, MoreIcon, SubMenu } from '@pancakeswap/uikit'
import { memo } from 'react'
import styled from 'styled-components'

export const StyledButton = styled(Button)`
  color: ${({ theme }) => theme.colors.text};
  font-weight: 400;
  padding: 8px 16px;
  line-height: 24px;
  height: auto;
`

export const PoolListItemAction = memo(() => {
  const { t } = useTranslation()
  const { theme } = useTheme()
  return (
    <SubMenu
      style={{
        background: theme.card.background,
        borderColor: theme.colors.cardBorder,
      }}
      component={
        <Button scale="xs" variant="text">
          <MoreIcon />
        </Button>
      }
    >
      <StyledButton scale="sm" variant="text" as="a">
        {t('View pool details')}
      </StyledButton>
      <StyledButton scale="sm" variant="text" as="a">
        {t('Add Liquidity')}
      </StyledButton>
      <StyledButton scale="sm" variant="text" as="a">
        {t('View info page')}
      </StyledButton>
    </SubMenu>
  )
})
