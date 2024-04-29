import { Flex, FlexProps } from '@pancakeswap/uikit'
import { useEffect } from 'react'
import { styled } from 'styled-components'

const DropdownContainer = styled(Flex)`
  position: absolute;
  z-index: 2;
  flex-direction: column;
  overflow: hidden;
  border-radius: ${({ theme }) => theme.radii.card};
  background-color: ${({ theme }) => theme.card.background};
  border: solid 1px ${({ theme }) => theme.colors.cardBorder};

  > div {
    width: 100%;
    padding: 8px 16px;

    &:hover {
      text-decoration: none;
      background-color: ${({ theme }) => theme.colors.dropdown};
    }

    &:first-child {
      padding-top: 16px;
    }
    &:last-child {
      padding-bottom: 16px;
    }
  }
`

interface DropdownProps extends FlexProps {
  setIsOpen: (value: boolean) => void
  dropdownRef: React.RefObject<HTMLDivElement>
  children: React.ReactNode
}

export const Dropdown: React.FC<React.PropsWithChildren<DropdownProps>> = ({
  setIsOpen,
  dropdownRef,
  children,
  ...props
}) => {
  useEffect(() => {
    const handleClickOutside = ({ target }: Event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(target as HTMLElement)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [dropdownRef, setIsOpen])

  return (
    <DropdownContainer ref={dropdownRef} {...props}>
      {children}
    </DropdownContainer>
  )
}
