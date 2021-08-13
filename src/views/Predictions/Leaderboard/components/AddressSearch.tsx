import React, { ChangeEvent, useState, useEffect } from 'react'
import { Box, Text, Input, useModal } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import { isAddress } from 'utils'
import styled from 'styled-components'
import WalletStatsModal from './WalletStatsModal'

const SubMenu = styled.div<{ isOpen: boolean }>`
  align-items: center;
  background: ${({ theme }) => theme.colors.input};
  border: 1px solid ${({ theme }) => theme.colors.inputSecondary};
  border-radius: 0 0 ${({ theme }) => theme.radii.default} ${({ theme }) => theme.radii.default};
  bottom: -64px;
  height: 64px;
  left: 0;
  padding-bottom: 8px;
  padding-top: 16px;
  position: absolute;
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

const AddressSearch = () => {
  const [value, setValue] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const { t } = useTranslation()
  const [onPresentWalletStatsModal] = useModal(
    <WalletStatsModal account={value} onBeforeDismiss={() => setValue('')} />,
  )

  const handleChange = (evt: ChangeEvent<HTMLInputElement>) => {
    const { value: newValue } = evt.target
    setValue(newValue)
  }

  const handleClick = () => {
    setIsOpen(false)
    onPresentWalletStatsModal()
  }

  useEffect(() => {
    const address = isAddress(value)
    setIsOpen(!!address)
  }, [value, setIsOpen])

  return (
    <Box position="relative">
      <Input
        placeholder={t('Search %subject%', { subject: t('Address').toLowerCase() })}
        value={value}
        onChange={handleChange}
        style={{ position: 'relative', zIndex: 16 }}
      />
      <SubMenu isOpen={isOpen}>
        <AddressLink onClick={handleClick}>{value}</AddressLink>
      </SubMenu>
    </Box>
  )
}

export default AddressSearch
