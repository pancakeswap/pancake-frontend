import React from 'react'
import { Button, Card, CardBody, Flex, Heading, Text } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import { Link } from 'react-router-dom'

const NoProfileCard = () => {
  const { t } = useTranslation()

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
              {t("You haven't set up your profile yet!")}
            </Heading>
            <Text>{t('You can do this at any time by clicking on your profile picture in the menu')}</Text>
          </div>
          <Button as={Link} to="/profile" mt={['16px', null, 0]}>
            {t('Set up now')}
          </Button>
        </Flex>
      </CardBody>
    </Card>
  )
}

export default NoProfileCard
