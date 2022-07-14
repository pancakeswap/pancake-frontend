import { Button, Heading, Text } from '@pancakeswap/uikit'
import _isEmpty from 'lodash/isEmpty'
import styled from 'styled-components'

const Container = styled.div`
  margin-right: 4px;
`

const ActionButton = ({ title, description, ...props }) => {
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
