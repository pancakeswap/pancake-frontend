import React, { useState } from 'react'
import { Button, Card, CardBody, CardHeader, Heading, Text } from '@pancakeswap/uikit'
import uniqueId from 'lodash/uniqueId'
import { useTranslation } from 'contexts/Localization'
import Choice from './Choice'

const MINIMUM_CHOICES = 2
const makeChoice = () => ({ id: uniqueId(), value: '' })

const Choices = () => {
  const [choices, setChoices] = useState([makeChoice(), makeChoice()])
  const { t } = useTranslation()
  const hasMinimumChoices = choices.filter((choice) => choice.value.length > 0).length >= MINIMUM_CHOICES

  const addChoice = () => {
    setChoices((prevChoices) => [...prevChoices, makeChoice()])
  }

  return (
    <Card>
      <CardHeader>
        <Heading as="h3" scale="md">
          {t('Choices')}
        </Heading>
      </CardHeader>
      <CardBody>
        {choices.map(({ id, value }, index) => {
          const handleTextInput = (newValue: string) => {
            setChoices((prevChoices) => {
              const newChoices = [...prevChoices]
              const choiceIndex = newChoices.findIndex((newChoice) => newChoice.id === id)
              newChoices[choiceIndex].value = newValue
              return newChoices
            })
          }

          const handleRemove = () => {
            setChoices((prevChoices) => prevChoices.filter((newPrevChoice) => newPrevChoice.id !== id))
          }

          return (
            <Choice
              key={id}
              scale="lg"
              onTextInput={handleTextInput}
              placeholder={t('Input choice text')}
              value={value}
              onRemove={index > 1 ? handleRemove : undefined}
            />
          )
        })}

        <Button onClick={addChoice} disabled={!hasMinimumChoices}>
          {t('Add Choice')}
        </Button>
      </CardBody>
    </Card>
  )
}

export default Choices
