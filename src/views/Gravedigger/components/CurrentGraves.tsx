import React from 'react'
import { Grave } from 'redux/types'
import { Flex, Heading, LinkExternal, Text } from '@rug-zombie-libs/uikit'
import styled from 'styled-components'
import { ExternalLink } from 'react-feather'

export type CurrentGravesProps = {
  grave: Grave
}

const Container = styled(Heading).attrs({ scale: 'xl' })`
  padding: 10px;
  line-height: 44px;
  text-align: center;
`

const CurrentGraves: React.FC<CurrentGravesProps> = (props) => {
  const { grave } = props
  const link = `https://app.euler.tools/token/${grave.name === 'RugZombie Common' ? '0x50ba8BF9E34f0F83F96a340387d1d3888BA4B3b5' : grave.rug.address[56]}`
  return (
    <Container>
      <Flex style={{ justifyContent: 'center' }}>
        <LinkExternal href={link} target='_blank'>
          <Text color='green'>
            {grave.name}
          </Text>
        </LinkExternal>
      </Flex>
    </Container>
  )
}

export default CurrentGraves