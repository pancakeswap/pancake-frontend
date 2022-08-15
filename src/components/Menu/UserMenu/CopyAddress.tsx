import { Box, Flex, FlexProps } from '@pancakeswap/uikit'
import styled from 'styled-components'
import { useTranslation } from '@pancakeswap/localization'
import { CopyButton } from '../../CopyButton'

interface CopyAddressProps extends FlexProps {
  account: string
}

const Wrapper = styled(Flex)`
  align-items: center;
  background-color: ${({ theme }) => theme.colors.dropdown};
  border-radius: 16px;
  position: relative;
`

const Address = styled.div`
  flex: 1;
  position: relative;
  padding-left: 16px;

  & > input {
    background: transparent;
    border: 0;
    color: ${({ theme }) => theme.colors.text};
    display: block;
    font-weight: 600;
    font-size: 16px;
    padding: 0;
    width: 100%;

    &:focus {
      outline: 0;
    }
  }

  &:after {
    background: linear-gradient(
      to right,
      ${({ theme }) => theme.colors.background}00,
      ${({ theme }) => theme.colors.background}E6
    );
    content: '';
    height: 100%;
    pointer-events: none;
    position: absolute;
    right: 0;
    top: 0;
    width: 40px;
  }
`

const CopyAddress: React.FC<React.PropsWithChildren<CopyAddressProps>> = ({ account, ...props }) => {
  const { t } = useTranslation()
  return (
    <Box position="relative" {...props}>
      <Wrapper>
        <Address title={account}>
          <input type="text" readOnly value={account} />
        </Address>
        <Flex margin="12px">
          <CopyButton width="24px" text={account} tooltipMessage={t('Copied')} tooltipTop={-40} />
        </Flex>
      </Wrapper>
    </Box>
  )
}

export default CopyAddress
