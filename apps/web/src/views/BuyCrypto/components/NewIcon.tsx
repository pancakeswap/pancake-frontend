import { useTranslation } from '@pancakeswap/localization'
import { Button } from '@pancakeswap/uikit'
import styled from 'styled-components'

const StyledButton = styled(Button)`
  color: ${({ theme }) => theme.colors.success};
  border-color: ${({ theme }) => theme.colors.success};
`
export function NewIconButton() {
  const { t } = useTranslation()
  return (
    <StyledButton height="25px" width="20px" variant="secondary">
      {t('New')}
    </StyledButton>
  )
}
