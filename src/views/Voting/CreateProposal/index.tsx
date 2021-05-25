import React, { ChangeEvent, FormEvent, lazy, useState } from 'react'
import { Box, Card, CardBody, CardHeader, Heading, Input, Text } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import Container from 'components/layout/Container'
import Layout from '../components/Layout'
import { Label } from './styles'

const SimpleMde = lazy(() => import('components/SimpleMde'))

const CreateProposal = () => {
  const [state, setState] = useState({
    title: '',
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
              <Label htmlFor="title">{t('Title')}</Label>
              <Input id="title" name="title" value={state.title} scale="lg" onChange={handleChange} />
            </Box>
            <Box mb="24px">
              <Label htmlFor="content">{t('Content')}</Label>
              <Text color="textSubtle" mb="8px">
                {t('Tip: write in Markdown!')}
              </Text>
              <SimpleMde />
            </Box>
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
