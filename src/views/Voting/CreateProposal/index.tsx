import React, { ChangeEvent, FormEvent, lazy, useEffect, useState } from 'react'
import {
  Box,
  Breadcrumbs,
  Button,
  Card,
  CardBody,
  CardHeader,
  Flex,
  Heading,
  Input,
  LinkExternal,
  Text,
} from '@pancakeswap/uikit'
import { useWeb3React } from '@web3-react/core'
import times from 'lodash/times'
import useWeb3 from 'hooks/useWeb3'
import { useHistory } from 'react-router'
import { useInitialBlock } from 'state/hooks'
import { getBscScanAddressUrl, getBscScanBlockNumberUrl } from 'utils/bscscan'
import truncateWalletAddress from 'utils/truncateWalletAddress'
import { useTranslation } from 'contexts/Localization'
import Container from 'components/layout/Container'
import { DatePicker, TimePicker } from 'components/DatePicker'
import BreadcrumbLink from '../components/BreadcrumbLink'
import { sendSnaphotData, Message, generateMetaData, generatePayloadData } from '../helpers'
import Layout from '../components/Layout'
import { Label, SecondaryLabel } from './styles'
import Choices, { Choice, makeChoice, MINIMUM_CHOICES } from './Choices'
import { combineDateAndTime, isFormValid } from './helpers'
import { FormState } from './types'
import { SnapshotCommand } from '../types'

const SimpleMde = lazy(() => import('components/SimpleMde'))

const CreateProposal = () => {
  const [state, setState] = useState<FormState>({
    name: '',
    body: '',
    choices: times(MINIMUM_CHOICES).map(makeChoice),
    startDate: null,
    startTime: null,
    endDate: null,
    endTime: null,
    snapshot: 0,
  })
  const { t } = useTranslation()
  const { account } = useWeb3React()
  const initialBlock = useInitialBlock()
  const { push } = useHistory()
  const web3 = useWeb3()
  const { name, body, choices, startDate, startTime, endDate, endTime, snapshot } = state

  const handleSubmit = async (evt: FormEvent<HTMLFormElement>) => {
    evt.preventDefault()

    try {
      const proposal = JSON.stringify({
        ...generatePayloadData(),
        type: SnapshotCommand.PROPOSAL,
        payload: {
          name,
          body,
          snapshot,
          start: combineDateAndTime(startDate, startTime),
          end: combineDateAndTime(endDate, endTime),
          choices: choices
            .filter((choice) => choice.value)
            .map((choice) => {
              return choice.value
            }),
          metadata: generateMetaData(),
        },
      })
      const sig = await web3.eth.personal.sign(proposal, account, null)
      const msg: Message = { address: account, msg: proposal, sig }

      // Save proposal to snapshot
      const data = await sendSnaphotData(msg)

      // Redirect user to newly created proposal page
      push(`/voting/proposal/${data.ipfsHash}`)
    } catch (error) {
      console.error(error)
    }
  }

  const updateValue = (key: string, value: string | Choice[] | Date) => {
    setState((prevState) => ({
      ...prevState,
      [key]: value,
    }))
  }

  const handleChange = (evt: ChangeEvent<HTMLInputElement>) => {
    const { name: inputName, value } = evt.currentTarget
    updateValue(inputName, value)
  }

  const handleSimpleMdeChange = (value: string) => {
    updateValue('body', value)
  }

  const handleChoiceChange = (newChoices: Choice[]) => {
    updateValue('choices', newChoices)
  }

  const handleDateChange = (key: string) => (value: Date) => {
    updateValue(key, value)
  }

  useEffect(() => {
    if (initialBlock > 0) {
      setState((prevState) => ({
        ...prevState,
        snapshot: initialBlock,
      }))
    }
  }, [initialBlock, setState])

  return (
    <Container py="40px">
      <Box mb="48px">
        <Breadcrumbs>
          <BreadcrumbLink to="/">{t('Home')}</BreadcrumbLink>
          <BreadcrumbLink to="/voting">{t('Voting')}</BreadcrumbLink>
          <Text>{t('Make a Proposal')}</Text>
        </Breadcrumbs>
      </Box>
      <form onSubmit={handleSubmit}>
        <Layout>
          <Box>
            <Box mb="24px">
              <Label htmlFor="name">{t('Title')}</Label>
              <Input id="name" name="name" value={name} scale="lg" onChange={handleChange} required />
            </Box>
            <Box mb="24px">
              <Label htmlFor="body">{t('Content')}</Label>
              <Text color="textSubtle" mb="8px">
                {t('Tip: write in Markdown!')}
              </Text>
              <SimpleMde id="body" name="body" onTextChange={handleSimpleMdeChange} value={body} required />
            </Box>
            <Choices choices={choices} onChange={handleChoiceChange} />
          </Box>
          <Box>
            <Card>
              <CardHeader>
                <Heading as="h3" scale="md">
                  {t('Actions')}
                </Heading>
              </CardHeader>
              <CardBody>
                <Box mb="24px">
                  <SecondaryLabel>{t('Start Date')}</SecondaryLabel>
                  <DatePicker name="startDate" onChange={handleDateChange('startDate')} selected={startDate} />
                </Box>
                <Box mb="24px">
                  <SecondaryLabel>{t('Start Time')}</SecondaryLabel>
                  <TimePicker name="startTime" onChange={handleDateChange('startTime')} selected={startTime} />
                </Box>
                <Box mb="24px">
                  <SecondaryLabel>{t('End Date')}</SecondaryLabel>
                  <DatePicker name="endDate" onChange={handleDateChange('endDate')} selected={endDate} />
                </Box>
                <Box mb="24px">
                  <SecondaryLabel>{t('End Time')}</SecondaryLabel>
                  <TimePicker name="endTime" onChange={handleDateChange('endTime')} selected={endTime} />
                </Box>
                {account && (
                  <Flex alignItems="center" mb="8px">
                    <Text color="textSubtle" mr="16px">
                      {t('Creator')}
                    </Text>
                    <LinkExternal href={getBscScanAddressUrl(account)}>{truncateWalletAddress(account)}</LinkExternal>
                  </Flex>
                )}
                <Flex alignItems="center" mb="16px">
                  <Text color="textSubtle" mr="16px">
                    {t('Snapshot')}
                  </Text>
                  <LinkExternal href={getBscScanBlockNumberUrl(snapshot)}>{snapshot}</LinkExternal>
                </Flex>
                <Button type="submit" width="100%" disabled={!isFormValid(state)}>
                  {t('Publish')}
                </Button>
              </CardBody>
            </Card>
          </Box>
        </Layout>
      </form>
    </Container>
  )
}

export default CreateProposal
