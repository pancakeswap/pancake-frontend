import { useTranslation } from '@pancakeswap/localization'
import { copyText, useToast } from '@pancakeswap/uikit'
import { styled } from 'styled-components'

const StyledInternalAddress = styled('span')`
  text-decoration: none;
  cursor: pointer;
  font-weight: 500;

  &:hover {
    color: ${({ theme }) => theme.colors.primary};
  }

  &:focus {
    outline: none;
    text-decoration: underline;
  }

  &:active {
    text-decoration: none;
  }
`

const InternalLink = function ({ children, ...props }) {
  const { toastError, toastSuccess } = useToast()
  const { t } = useTranslation()

  const handleOnClick = () => {
    copyText(props?.address)
    toastSuccess(t('Address Copied!'))
  }
  return (
    <StyledInternalAddress {...props} onClick={handleOnClick}>
      {children}
    </StyledInternalAddress>
  )
}

export default InternalLink
