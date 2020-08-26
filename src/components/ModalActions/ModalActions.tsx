import React from 'react'
import styled from 'styled-components'

import Spacer from '../Spacer'

const ModalActions: React.FC = ({ children }) => {
  const l = React.Children.toArray(children).length
  return (
    <StyledModalActions>
      {React.Children.map(children, (child, i) => (
        <>
          <StyledModalAction>
            {child}
          </StyledModalAction>
          {i < l - 1 && <Spacer />}
        </>
      ))}
    </StyledModalActions>
  )
}

const StyledModalActions = styled.div`
  align-items: center;
  background-color: ${props => props.theme.color.grey[100]}00;
  display: flex;
  margin: 0;
  padding: ${props => props.theme.spacing[4]}px;
`

const StyledModalAction = styled.div`
  flex: 1;
`

export default ModalActions