import React, { useCallback } from "react"
import { Button } from './styles';

type Props = {
  title: string,
  index: number,
  active: boolean,
  setSelectedTab: (index: number) => void,
}


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
