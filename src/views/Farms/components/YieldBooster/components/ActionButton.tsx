import { Button, Heading, Text, ButtonProps } from '@pancakeswap/uikit'
import _isEmpty from 'lodash/isEmpty'
import { ReactNode } from 'react'
import styled from 'styled-components'

const Container = styled.div`
  margin-right: 4px;
`

interface ActionButtonPropsType extends ButtonProps {
  title: string
  description: string
  button?: ReactNode
}

const ActionButton: React.FC<ActionButtonPropsType> = ({ title, description, button, ...props }) => {
  let btn = null

  if (button) {
    btn = button
  } else if (!_isEmpty(props)) {
    btn = <Button {...props} />
  }

  return (
    <>
      <Container>
        <Heading>{title}</Heading>
        <Text color="textSubtle" fontSize="12px">
          {description}
        </Text>
      </Container>
      {btn}
    </>
  )
}

export default ActionButton
