import React, { useCallback } from "react"
import styled from 'styled-components';

type Props = {
  title: string,
  index: number,
  active: boolean,
  setSelectedTab: (index: number) => void,
}

const Button = styled.button<{ active: boolean }>`
  outline: none;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 4px 12px;
  /* Light/Tertiary */
  background: #EFF4F5;
  /* Button shadow */
  box-shadow: inset 0px -1px 0px rgba(14, 14, 44, 0.4);
  border-radius: 16px;
  border: none;
  color: #1FC7D4;
  &:hover{
    background-color: #f5f8f8;
  }
  ${({ active }) => active && `
        background: #1FC7D4;
    box-shadow: inset 0px -1px 0px rgba(14, 14, 44, 0.4);
    border-radius: 16px;
    color: #FFFFFF;
  `}
`

const TabTitle: React.FC<Props> = ({ title, index, active, setSelectedTab }) => {

  const onClick = useCallback(() => {
    setSelectedTab(index)
  }, [setSelectedTab, index])

  return (
    <Button type="button" active={active} onClick={onClick}>{title}</Button>
  )
}

export default TabTitle
