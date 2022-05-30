/* eslint-disable @typescript-eslint/no-useless-constructor */
import { Container } from '@mui/material'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import SpiesTable from '../../components/spies/SpiesTable'
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
      <Container maxWidth="lg" style={{ marginTop: '20px' }}>
        <SpiesTable />
      </Container>
    )
  }
}

const mapStateToProps = (state: RootState) => {
  return { state }
}

export default connect(mapStateToProps)(Spies)
