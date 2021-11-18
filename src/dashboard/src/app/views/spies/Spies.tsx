import { Container, Paper } from '@mui/material'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import SpiesTable from '../../components/SpiesTable'
import SpyEditor from '../../components/SpyEditor'
import { AppDispatch, RootState } from '../../redux/store'

interface IProps {
  state: RootState
  dispatch: AppDispatch
}

class Spies extends Component<IProps> {
  constructor(props: IProps) {
    super(props)
  }

  render() {
    return (
      <div>
        <SpiesTable />
      </div>
    )
  }
}

const mapStateToProps = (state: RootState) => {
  return { state }
}

export default connect(mapStateToProps)(Spies)
