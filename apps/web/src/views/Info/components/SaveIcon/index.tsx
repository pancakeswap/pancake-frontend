import { HTMLAttributes } from 'react'
import styled from 'styled-components'
import { StarFillIcon, StarLineIcon } from '@pancakeswap/uikit'
import useTheme from 'hooks/useTheme'

const HoverIcon = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  :hover {
    cursor: pointer;
    opacity: 0.6;
  }
`

const SaveIcon: React.FC<React.PropsWithChildren<{ fill: boolean } & HTMLAttributes<HTMLDivElement>>> = ({
  fill = false,
  ...rest
}) => {
  const { theme } = useTheme()
  return (
    <HoverIcon {...rest}>
      {fill ? (
        <StarFillIcon stroke={theme.colors.warning} color={theme.colors.warning} />
      ) : (
        <StarLineIcon stroke={theme.colors.textDisabled} />
      )}
    </HoverIcon>
  )
}

export default SaveIcon
