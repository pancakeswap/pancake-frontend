import { useTranslation } from '@pancakeswap/localization'
import { Box, Button, InfoIcon } from '@pancakeswap/uikit'
import { styled } from 'styled-components'

const StyledButton = styled(Button)`
  width: 100%;
  margin: 8px 0;
  border-radius: 24px;
`
export const CLAIM_BUTTON_ID = 'claim-reward-button'

export const ClaimButton = () => {
  const { t } = useTranslation()

  return (
    <Box id={CLAIM_BUTTON_ID}>
      {/* <StyledButton>{t('Claim the reward')}</StyledButton> */}
      <StyledButton disabled endIcon={<InfoIcon color="textDisabled" />}>
        {t('Unavailable')}
      </StyledButton>
    </Box>
  )
}
