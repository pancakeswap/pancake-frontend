import { useTranslation } from '@pancakeswap/localization'
import {
  Box,
  Card,
  CardBody,
  CardHeader,
  Flex,
  FlexGap,
  Heading,
  Input,
  ReactMarkdown,
  Tag,
  Text,
} from '@pancakeswap/uikit'
import { DatePicker, DatePickerPortal, TimePicker } from 'components/DatePicker'
import dynamic from 'next/dynamic'
import React, { useMemo } from 'react'
import { styled } from 'styled-components'
import { StateType } from 'views/DashboardQuestEdit/context/types'
import { CompletionStatus } from 'views/DashboardQuestEdit/type'

const TimelineGroup = styled(Flex)`
  flex-wrap: wrap;
  justify-content: space-between;

  > div {
    width: calc(50% - 10px);
    margin-bottom: 16px;

    &:nth-child(3),
    &:nth-child(4) {
      margin-bottom: 0;
    }

    .react-datepicker-wrapper {
      width: 100%;
    }
  }
`

const EasyMde = dynamic(() => import('components/EasyMde'), {
  ssr: false,
})

interface EditTemplateProps {
  titleText: string
  state: StateType
  questId?: string
  uploadImageComponent?: JSX.Element
  updateValue: (key: string, value: string | Date) => void
}

export const EditTemplate: React.FC<React.PropsWithChildren<EditTemplateProps>> = ({
  titleText,
  state,
  questId,
  uploadImageComponent,
  updateValue,
  children,
}) => {
  const { t } = useTranslation()
  const { title, description, startDate, startTime, endDate, endTime, completionStatus, reward } = state

  const disableInput = useMemo(
    () => Boolean(completionStatus === CompletionStatus.SCHEDULED && reward),
    [reward, completionStatus],
  )

  return (
    <FlexGap
      gap="32px"
      width="100%"
      flexDirection="column"
      p={['0 0 150px 0', '0 0 150px 0', '0 0 150px 0', '0 0 150px 0', '40px 40px 200px 40px']}
    >
      <Box>
        <Flex mb="8px">
          <Text bold fontSize="24px" lineHeight="28px" mr="16px">
            {titleText}
          </Text>
          {questId && (
            <>
              {completionStatus === CompletionStatus.DRAFTED && <Tag variant="textDisabled">{t('Drafted')}</Tag>}
              {completionStatus === CompletionStatus.SCHEDULED && <Tag variant="textSubtle">{t('Schedule')}</Tag>}
            </>
          )}
        </Flex>
        <Input value={title} onChange={(e) => updateValue('title', e.currentTarget.value)} />
      </Box>
      {uploadImageComponent}
      <Box position="relative" zIndex={3}>
        <Text bold fontSize="24px" lineHeight="28px" mb="8px">
          {t('Timeline')}
        </Text>
        <TimelineGroup>
          <Box>
            <Text bold>{t('Start Date')}</Text>
            <DatePicker
              name="startDate"
              selected={startDate}
              disabled={disableInput}
              placeholderText="YYYY/MM/DD"
              onChange={(value: Date) => updateValue('startDate', value)}
            />
          </Box>
          <Box>
            <Text bold>{t('Start Time')}</Text>
            <TimePicker
              name="startTime"
              selected={startTime}
              disabled={disableInput}
              placeholderText="00:00"
              onChange={(value: Date) => updateValue('startTime', value)}
            />
          </Box>
          <Box>
            <Text bold>{t('End Date')}</Text>
            <DatePicker
              name="endDate"
              selected={endDate}
              disabled={disableInput}
              placeholderText="YYYY/MM/DD"
              onChange={(value: Date) => updateValue('endDate', value)}
            />
          </Box>
          <Box>
            <Text bold>{t('End Time')}</Text>
            <TimePicker
              name="endTime"
              selected={endTime}
              disabled={disableInput}
              placeholderText="00:00"
              onChange={(value: Date) => updateValue('endTime', value)}
            />
          </Box>
        </TimelineGroup>
        <DatePickerPortal />
      </Box>

      {children}

      <Box position="relative" zIndex={1}>
        <Text bold fontSize="24px" lineHeight="28px" mb="8px">
          {t('Description')}
        </Text>
        <Text color="textSubtle" mb="8px">
          {t('Tip: write in Markdown!')}
        </Text>
        <EasyMde
          id="body"
          name="body"
          required
          value={description}
          onTextChange={(value) => updateValue('description', value)}
        />
      </Box>

      {description && (
        <Box mb="24px">
          <Card>
            <CardHeader>
              <Heading as="h3" scale="md">
                {t('Preview')}
              </Heading>
            </CardHeader>
            <CardBody p="0" px="24px">
              <ReactMarkdown>{description}</ReactMarkdown>
            </CardBody>
          </Card>
        </Box>
      )}
    </FlexGap>
  )
}
