import React, { ChangeEvent, FormEvent, lazy, useState } from 'react'
import { Box, Card, CardBody, CardHeader, Heading, Input, Text } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import Container from 'components/layout/Container'
import Layout from '../components/Layout'
import { Label } from './styles'
import Choices from './Choices'

const SimpleMde = lazy(() => import('components/SimpleMde'))

const CreateProposal = () => {
  const [state, setState] = useState({
    name: '',
    body: '',
    choices: [],
    start: '',
    end: '',
    snapshot: '',
    metadata: {},
  })
  const { t } = useTranslation()

  const handleSubmit = (evt: FormEvent<HTMLFormElement>) => {
    evt.preventDefault()
  }

  const handleChange = (evt: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = evt.currentTarget
    setState((prevState) => ({
      ...prevState,
      [name]: value,
    }))
  }

  return (
    <Container py="40px">
      <form onSubmit={handleSubmit}>
        <Layout>
          <Box>
            <Box mb="24px">
              <Label htmlFor="name">{t('Title')}</Label>
              <Input id="name" name="name" value={state.name} scale="lg" onChange={handleChange} />
            </Box>
            <Box mb="24px">
              <Label htmlFor="body">{t('Content')}</Label>
              <Text color="textSubtle" mb="8px">
                {t('Tip: write in Markdown!')}
              </Text>
              <SimpleMde id="body" name="body" onChange={handleChange} />
            </Box>
            <Choices />
          </Box>
          <Box>
            <Card>
              <CardHeader>
                <Heading as="h3" scale="md">
                  {t('Actions')}
                </Heading>
              </CardHeader>
              <CardBody>body</CardBody>
            </Card>
          </Box>
        </Layout>
      </form>
    </Container>
  )
}

export default CreateProposal
