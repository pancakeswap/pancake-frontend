import React, { ChangeEvent, useState, useEffect } from 'react'
import { Box, Text, Input, useModal } from '@pancakeswap/uikit'
import styled from 'styled-components'
import { isAddress } from 'utils'
import { useAppDispatch } from 'state'
import { fetchAddressResult } from 'state/predictions'
import { useGetAddressResult } from 'state/predictions/hooks'
import { useTranslation } from 'contexts/Localization'
import CircleLoader from 'components/Loader/CircleLoader'
import WalletStatsModal from './WalletStatsModal'

enum ResultStatus {
  NOT_VALID,
  FOUND,
  NOT_FOUND,
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

const AddressSearch = () => {
  const [state, setState] = useState(initialState)
  const addressResult = useGetAddressResult(state.value)
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const { isFetching, resultFound, value } = state

  const [onPresentWalletStatsModal] = useModal(
    <WalletStatsModal account={state.value} onBeforeDismiss={() => setState(initialState)} />,
  )

  const handleChange = (evt: ChangeEvent<HTMLInputElement>) => {
    const { value: newValue } = evt.target
    setState((prevState) => ({
      ...prevState,
      value: newValue,
    }))
  }

  const handleClick = () => {
    setState(initialState)
    onPresentWalletStatsModal()
  }

  // When we have a valid address fetch the data
  useEffect(() => {
    const isValidAddress = isAddress(value) !== false

    const getAddressResult = async () => {
      try {
        setState((prevState) => ({ ...prevState, isFetching: true }))
        await dispatch(fetchAddressResult(value))
      } finally {
        setState((prevState) => ({ ...prevState, isFetching: false }))
      }
    }

    if (isValidAddress) {
      getAddressResult()
    } else {
      setState((prevState) => ({ ...prevState, resultFound: ResultStatus.NOT_VALID }))
    }
  }, [value, dispatch, setState])

  useEffect(() => {
    // Undefined means we have not checked yet
    if (addressResult !== undefined) {
      setState((prevState) => ({
        ...prevState,
        resultFound: addressResult === null ? ResultStatus.NOT_FOUND : ResultStatus.FOUND,
      }))
    }
  }, [addressResult, setState])

  return (
    <Box position="relative">
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

export default AddressSearch
