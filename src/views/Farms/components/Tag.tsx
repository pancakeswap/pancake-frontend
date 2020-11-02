import styled from 'styled-components'

interface Props {
  variant?: string
}

const colorVariants = {
  pink: '#ED4B9E',
  purple: '#7645D9',
}

const Tag = styled.div<Props>`
  align-items: center;
  background-color: transparent;
  border: 2px solid ${({ variant }) => colorVariants[variant || 'purple']};
  border-radius: 16px;
  color: ${({ variant }) => colorVariants[variant || 'purple']};
  display: inline-flex;
  font-size: 14px;
  height: 24px;
  justify-content: center;
  line-height: 1em;
  padding: 0 8px;
`

Tag.defaultProps = {
  variant: 'purple',
}

export default Tag
