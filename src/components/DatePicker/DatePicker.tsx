import React from 'react'
import ReactDatePicker, { ReactDatePickerProps } from 'react-datepicker'
import { Input, InputProps } from '@pancakeswap/uikit'

import 'react-datepicker/dist/react-datepicker.css'

export interface DatePickerProps extends ReactDatePickerProps {
  inputProps?: InputProps
}

const DatePicker: React.FC<DatePickerProps> = ({ inputProps = {}, ...props }) => {
  return (
    <ReactDatePicker customInput={<Input {...inputProps} />} portalId="reactDatePicker" dateFormat="PPP" {...props} />
  )
}

export default DatePicker
