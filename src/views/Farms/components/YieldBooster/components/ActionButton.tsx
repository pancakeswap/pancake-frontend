import { Button, Heading, Text, ButtonProps } from '@pancakeswap/uikit'
import _isEmpty from 'lodash/isEmpty'
import styled from 'styled-components'

const Container = styled.div`
  margin-right: 4px;
`

interface ActionButtonPropsType extends ButtonProps {
  title: string
  description: string
}

const ActionButton: React.FC<ActionButtonPropsType> = ({ title, description, ...props }) => {
  return (
    <>
      <Container>
        <Heading>{title}</Heading>
        <Text color="textSubtle" fontSize="12px">
          {description}
        </Text>
      </Container>
      {_isEmpty(props) ? null : <Button {...props} />}
    </>
  )
}

export default ActionButton
