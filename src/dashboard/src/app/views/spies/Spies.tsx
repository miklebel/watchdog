import { UserDTO } from '@miklebel/watchdog-core'
import { Dispatch, ThunkDispatch } from '@reduxjs/toolkit'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { AppDispatch, RootState } from '../../redux/store'
import { getUserAsync } from '../../redux/user/user'

interface IProps {
  state: RootState
  dispatch: AppDispatch
}

class Spies extends Component<IProps> {
  constructor(props: IProps) {
    super(props)
  }
  async componentDidMount() {
    // await this.props.dispatch(getUserAsync(this.props.state))
  }
  render() {
    return <div>{JSON.stringify(this.props.state.user.user)}</div>
  }
}

const mapStateToProps = (state: RootState) => {
  return { state }
}

export default connect(mapStateToProps)(Spies)
