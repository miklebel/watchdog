import React, { Component } from 'react'
import TextField from '@mui/material/TextField'
import { LocalizationProvider, DatePicker as MuiDatePicker } from '@mui/lab'
import AdapterDateFns from '@mui/lab/AdapterDateFns'

interface IProps {
  value: Date
  label: string
  onChange(date: Date | null): void
}

export class DatePicker extends Component<IProps> {
  constructor(props: IProps) {
    super(props)
  }

  render() {
    return (
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <MuiDatePicker
          label={this.props.label}
          value={this.props.value}
          onChange={this.props.onChange}
          renderInput={params => <TextField {...params} />}
        />
      </LocalizationProvider>
    )
  }
}

export default DatePicker
