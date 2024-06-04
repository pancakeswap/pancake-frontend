import { useTranslation } from '@pancakeswap/localization'
import DatePicker, { DatePickerProps } from './DatePicker'

const TimePicker: React.FC<React.PropsWithChildren<DatePickerProps>> = (props) => {
  const { t } = useTranslation()

  return (
    <DatePicker
      showTimeSelect
      showTimeSelectOnly
      timeIntervals={15}
      timeCaption={t('Time')}
      dateFormat="ppp"
      {...props}
    />
  )
}

export default TimePicker
