import React, { ChangeEvent, FormEvent, lazy, useState } from 'react'
import { Box, Card, CardBody, CardHeader, Heading, Input, Text } from '@pancakeswap/uikit'
import times from 'lodash/times'
import { useTranslation } from 'contexts/Localization'
import Container from 'components/layout/Container'
import DatePicker from 'components/DatePicker'
import Layout from '../components/Layout'
import { Label, SecondaryLabel } from './styles'
import Choices, { Choice, makeChoice, MINIMUM_CHOICES } from './Choices'

interface State {
  name: string
  body: string
  choices: Choice[]
  start: Date
  end: string
  snapshot: string
  metadata: Record<string, unknown>
}

const SimpleMde = lazy(() => import('components/SimpleMde'))

const CreateProposal = () => {
  const [state, setState] = useState<State>({
    name: '',
    body: '',
    choices: times(MINIMUM_CHOICES).map(makeChoice),
    start: null,
    end: '',
    snapshot: '',
    metadata: {},
  })
  const { t } = useTranslation()

  const handleSubmit = (evt: FormEvent<HTMLFormElement>) => {
    evt.preventDefault()
  }

  const updateValue = (key: string, value: string | Choice[] | Date) => {
    setState((prevState) => ({
      ...prevState,
      [key]: value,
    }))
  }

  const handleChange = (evt: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = evt.currentTarget
    updateValue(name, value)
  }

  const handleSimpleMdeChange = (value: string) => {
    updateValue('body', value)
  }

  const handleChoiceChange = (choices: Choice[]) => {
    updateValue('choices', choices)
  }

  const handleDateChange = (key: string) => (value: Date) => {
    updateValue(key, value)
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
              <SimpleMde id="body" name="body" onTextChange={handleSimpleMdeChange} />
            </Box>
            <Choices choices={state.choices} onChange={handleChoiceChange} />
          </Box>
          <Box>
            <Card>
              <CardHeader>
                <Heading as="h3" scale="md">
                  {t('Actions')}
                </Heading>
              </CardHeader>
              <CardBody>
                <Box>
                  <SecondaryLabel>{t('Start Date')}</SecondaryLabel>
                  <DatePicker name="startDate" onChange={handleDateChange('start')} selected={state.start} />
                </Box>
              </CardBody>
            </Card>
          </Box>
        </Layout>
      </form>
    </Container>
  )
}

export default CreateProposal
