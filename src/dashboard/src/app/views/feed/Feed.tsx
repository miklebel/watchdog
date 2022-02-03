import React, { Component } from 'react'
import { connect } from 'react-redux'
import TweetsTable from '../../components/feed/TweetsTable'
import VirtualizedAutocompleteProfile from '../../components/feed/VirtualizedAutocompleteProfile'
import { AppDispatch, RootState } from '../../redux/store'
import DatePicker from '../../components/common/DatePicker'
import moment from 'moment'
import { getTweetsStatsListAsync, offset, setDate } from '../../redux/feed/feed'
import { Container } from '@mui/material'

interface IProps {
  state: RootState
  dispatch: AppDispatch
}

class Feed extends Component<IProps> {
  constructor(props: IProps) {
    super(props)
    this.setDate = this.setDate.bind(this)
  }

  async setDate(date: Date | null) {
    if (date) await this.props.dispatch(setDate(moment(date).format('YYYY-MM-DD')))
    await this.props.dispatch(offset(0))
    await this.props.dispatch(getTweetsStatsListAsync(this.props.state))
  }

  render() {
    return (
      <Container maxWidth="lg">
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            width: '100%',
            alignItems: 'center',
            justifyContent: 'center',
            alignContent: 'space-between',
            gap: 3,
            marginTop: 10,
            marginBottom: 10
          }}
        >
          <VirtualizedAutocompleteProfile placeholder="Select twitter profile" />
          <DatePicker
            label={'Select date'}
            value={moment(this.props.state.feed.date, 'YYYY-MM-DD').toDate()}
            onChange={this.setDate}
          />
        </div>
        <TweetsTable />
      </Container>
    )
  }
}

const mapStateToProps = (state: RootState) => {
  return { state }
}

export default connect(mapStateToProps)(Feed)
