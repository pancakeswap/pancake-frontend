import React from 'react'
import { Button, Card, CardBody, Flex, Heading, Text } from '@pancakeswap-libs/uikit'
import useI18n from 'hooks/useI18n'
import { Link } from 'react-router-dom'

const NoProfileCard = () => {
  const TranslateString = useI18n()

  return (
    <Card mb="32px" isActive>
      <CardBody>
        <Flex
          alignItems={['start', null, 'center']}
          justifyContent={['start', null, 'space-between']}
          flexDirection={['column', null, 'row']}
        >
          <div>
            <Heading size="lg" mb="8px">
              {TranslateString(1052, "You haven't set up your profile yet!")}
            </Heading>
            <Text>
              {TranslateString(1054, 'You can do this at any time by clicking on your profile picture in the menu')}
            </Text>
          </div>
          <Button as={Link} to="/profile" mt={['16px', null, 0]}>
            {TranslateString(1050, 'Set up now')}
          </Button>
        </Flex>
      </CardBody>
    </Card>
  )
}

export default NoProfileCard
