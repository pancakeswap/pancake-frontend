import { useTranslation } from '@pancakeswap/localization'
import { Text, LogoIcon } from '@pancakeswap/uikit'
import { styled } from 'styled-components'

const StyledNotFound = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  height: calc(100vh - 64px);
  justify-content: center;
`

const NotSupport = () => {
  const { t } = useTranslation()

  return (
    <StyledNotFound>
      <LogoIcon width="5rem" mb="1rem" />
      <Text fontSize="1.5rem" mb="0.5rem">
        {t('Service Unavailable in Your Region')}
      </Text>
      <Text fontSize="1rem">
        {t('Due to regional regulatory requirements. We are unable to provide service for your region.')}
      </Text>
      <Text fontSize="1rem">{t('Please access from another location or check your settings.')}</Text>
    </StyledNotFound>
  )
}

NotSupport.pure = true

export default NotSupport
