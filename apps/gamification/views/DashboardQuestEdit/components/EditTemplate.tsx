import { useTranslation } from '@pancakeswap/localization'
import { Box, Flex, FlexGap, Input, Text } from '@pancakeswap/uikit'
import { DatePicker, DatePickerPortal, TimePicker } from 'components/DatePicker'
import dynamic from 'next/dynamic'
import React from 'react'
import { styled } from 'styled-components'

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

export interface StateType {
  title: string
  body: string
  amountPerWinner: string
  startDate: null | Date
  startTime: null | Date
  endDate: null | Date
  endTime: null | Date
}

interface EditTemplateProps {
  titleText: string
  state: StateType
  updateValue: (key: string, value: string | Date) => void
  handleDateChange: (key: string) => (value: Date) => void
  handleEasyMdeChange: (value: string) => void
}

export const EditTemplate: React.FC<React.PropsWithChildren<EditTemplateProps>> = ({
  titleText,
  state,
  updateValue,
  handleDateChange,
  handleEasyMdeChange,
  children,
}) => {
  const { t } = useTranslation()
  const { title, body, startDate, startTime, endDate, endTime } = state

  return (
    <FlexGap
      gap="32px"
      width="100%"
      flexDirection="column"
      p={['0 0 150px 0', '0 0 150px 0', '0 0 150px 0', '0 0 150px 0', '40px 40px 200px 40px']}
    >
      <Box>
        <Text bold fontSize="24px" lineHeight="28px" mb="8px">
          {titleText}
        </Text>
        <Input value={title} onChange={(e) => updateValue('title', e.currentTarget.value)} />
      </Box>
      <Box position="relative" zIndex={1}>
        <Text bold fontSize="24px" lineHeight="28px" mb="8px">
          {t('Timeline')}
        </Text>
        <TimelineGroup>
          <Box>
            <Text bold>{t('Start Date')}</Text>
            <DatePicker
              name="startDate"
              onChange={handleDateChange('startDate')}
              selected={startDate}
              placeholderText="YYYY/MM/DD"
            />
          </Box>
          <Box>
            <Text bold>{t('Start Time')}</Text>
            <TimePicker
              name="startTime"
              onChange={handleDateChange('startTime')}
              selected={startTime}
              placeholderText="00:00"
            />
          </Box>
          <Box>
            <Text bold>{t('End Date')}</Text>
            <DatePicker
              name="endDate"
              onChange={handleDateChange('endDate')}
              selected={endDate}
              placeholderText="YYYY/MM/DD"
            />
          </Box>
          <Box>
            <Text bold>{t('End Time')}</Text>
            <TimePicker
              name="endTime"
              onChange={handleDateChange('endTime')}
              selected={endTime}
              placeholderText="00:00"
            />
          </Box>
        </TimelineGroup>
        <DatePickerPortal />
      </Box>

      {children}

      <Box>
        <Text bold fontSize="24px" lineHeight="28px" mb="8px">
          {t('Description')}
        </Text>
        <Text color="textSubtle" mb="8px">
          {t('Tip: write in Markdown!')}
        </Text>
        <EasyMde id="body" name="body" onTextChange={handleEasyMdeChange} value={body} required />
      </Box>
    </FlexGap>
  )
}
