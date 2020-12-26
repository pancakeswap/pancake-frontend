import React, { useCallback } from "react"
import styled from 'styled-components';

type Props = {
  title: string,
  index: number,
  active: boolean,
  setSelectedTab: (index: number) => void,
}

const Button = styled.button<{ active: boolean }>`
  cursor: pointer;
  outline: none;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 4px 12px;
  background: ${({ theme }) => theme.colors.tertiary};
  box-shadow: inset 0px -1px 0px rgba(14, 14, 44, 0.4);
  border-radius: 16px;
  border: none;
  color: ${({ theme }) => theme.colors.primary};
  /* &:hover{
    background-color: #ffffff;
  } */
  ${({ active, theme }) => active && `
    background: ${theme.colors.primary};
    box-shadow: inset 0px -1px 0px rgba(14, 14, 44, 0.4);
    border-radius: 16px;
    color: ${theme.colors.invertedContrast};
  `}
`

const TabTitle: React.FC<Props> = ({ title, index, active, setSelectedTab }) => {

  const onClick = useCallback(() => {
    setSelectedTab(index)
  }, [setSelectedTab, index])

  return (
    <Button
      type="button"
      active={active}
      onClick={onClick}>
      {title}
    </Button>
  )
}

export default TabTitle
