import { ChangeEvent, useState, useEffect } from 'react'
import { Box, BoxProps, Text, Input } from '@pancakeswap/uikit'
import styled from 'styled-components'
import { isAddress } from 'utils'
import { useTranslation } from '@pancakeswap/localization'
import CircleLoader from 'components/Loader/CircleLoader'

enum ResultStatus {
  NOT_VALID,
  FOUND,
  NOT_FOUND,
}

interface AddressInputSelectProps extends BoxProps {
  onValidAddress?: (value: string) => Promise<boolean>
  onAddressClick: (value: string) => void
}

const SubMenu = styled.div<{ isOpen: boolean }>`
  align-items: center;
  background: ${({ theme }) => theme.colors.input};
  border: 1px solid ${({ theme }) => theme.colors.inputSecondary};
  border-radius: 0 0 ${({ theme }) => theme.radii.default} ${({ theme }) => theme.radii.default};
  left: 0;
  padding-bottom: 8px;
  padding-top: 16px;
  position: absolute;
  top: calc(100% - 12px);
  transition: transform 0.15s, opacity 0.15s;
  transform: scaleY(0);
  transform-origin: top;
  width: 100%;
  z-index: 15;

  ${({ isOpen }) =>
    isOpen &&
    `
    height: auto;
    opacity: 1;
    transform: scaleY(1);
  `}
`

const AddressLink = styled(Text)`
  cursor: pointer;
  overflow-wrap: break-word;
  font-weight: bold;
  padding-left: 16px;
  padding-right: 16px;
`

const initialState = {
  isFetching: false,
  resultFound: ResultStatus.NOT_VALID,
  value: '',
}

const defaultValidAddressHandler = () => Promise.resolve(true)

const AddressInputSelect: React.FC<AddressInputSelectProps> = ({
  onValidAddress = defaultValidAddressHandler,
  onAddressClick,
  ...props
}) => {
  const [state, setState] = useState(initialState)
  const { t } = useTranslation()
  const { isFetching, resultFound, value } = state

  const handleChange = (evt: ChangeEvent<HTMLInputElement>) => {
    const { value: newValue } = evt.target
    setState((prevState) => ({
      ...prevState,
      value: newValue,
    }))
  }

  const handleClick = () => {
    setState(initialState)
    onAddressClick(state.value)
  }

  // When we have a valid address fetch the data
  useEffect(() => {
    const isValidAddress = isAddress(value) !== false

    const validAddressHandler = async () => {
      try {
        setState((prevState) => ({ ...prevState, isFetching: true }))
        const hasResults = await onValidAddress(value)

        setState((prevState) => ({
          ...prevState,
          isFetching: false,
          resultFound: hasResults ? ResultStatus.FOUND : ResultStatus.NOT_FOUND,
        }))
      } catch {
        setState((prevState) => ({ ...prevState, isFetching: false }))
      }
    }

    if (isValidAddress) {
      validAddressHandler()
    } else {
      setState((prevState) => ({ ...prevState, resultFound: ResultStatus.NOT_VALID }))
    }
  }, [value, onValidAddress, setState])

  return (
    <Box position="relative" {...props}>
      <Input
        placeholder={t('Search %subject%', { subject: t('Address').toLowerCase() })}
        value={state.value}
        onChange={handleChange}
        style={{ position: 'relative', zIndex: 16, paddingRight: '40px' }}
      />
      {isFetching && (
        <Box position="absolute" top="12px" right="16px" style={{ zIndex: 17 }}>
          <CircleLoader />
        </Box>
      )}
      <SubMenu isOpen={resultFound !== ResultStatus.NOT_VALID}>
        {resultFound === ResultStatus.FOUND ? (
          <AddressLink onClick={handleClick}>{state.value}</AddressLink>
        ) : (
          <Text px="16px" fontWeight="bold">
            {t('No results found.')}
          </Text>
        )}
      </SubMenu>
    </Box>
  )
}

export default AddressInputSelect
