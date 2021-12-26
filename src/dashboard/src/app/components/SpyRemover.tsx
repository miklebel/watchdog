import {
  Box,
  Button,
  Modal,
  Slider,
  TextField,
  Typography,
  Switch,
  FormControlLabel,
  Grid,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContentText,
  DialogActions,
  DialogContent
} from '@mui/material'
import { Add, Edit, Delete } from '@mui/icons-material'
import React, { Component, ChangeEvent } from 'react'
import { connect } from 'react-redux'
import { AppDispatch, RootState } from '../redux/store'
import { CreateOrUpdateSpyDTO, SpyDTO, SpyStatus } from '@miklebel/watchdog-core'
import { createSpyAsync, deleteSpyAsync, getSpiesAsync } from '../redux/spies/spies'

interface IProps {
  state: RootState
  dispatch: AppDispatch
  spy: SpyDTO
}

interface IState {
  modal: boolean
}

class SpyRemover extends Component<IProps, IState> {
  constructor(props: IProps) {
    super(props)
    this.state = {
      modal: false
    }

    this.handleOpen = this.handleOpen.bind(this)
    this.handleClose = this.handleClose.bind(this)
    this.deleteOnClick = this.deleteOnClick.bind(this)
    this.keyPress = this.keyPress.bind(this)
  }

  private handleOpen() {
    this.setState({ ...this.state, modal: true })
  }

  private handleClose() {
    this.setState({ ...this.state, modal: false })
  }

  private async keyPress(event: React.KeyboardEvent<HTMLDivElement>) {
    if (event.key === 'Enter') await this.deleteOnClick()
  }

  private async deleteOnClick() {
    await this.props.dispatch(deleteSpyAsync({ state: this.props.state, props: this.props.spy }))
    this.handleClose()
    await this.props.dispatch(getSpiesAsync(this.props.state))
  }

  render() {
    return (
      <div>
        <IconButton aria-label="Expand profiles" size="small" onClick={this.handleOpen}>
          <Delete />
        </IconButton>
        <Dialog
          //   fullWidth
          open={this.state.modal}
          onClose={this.handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
          onKeyUp={this.keyPress}
        >
          <DialogTitle>{`Delete "${this.props.spy.name}"?`}</DialogTitle>
          <DialogContent>
            <DialogContentText>This can not be undone.</DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.deleteOnClick} variant="contained" color={'error'} fullWidth>
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    )
  }
}

const mapStateToProps = (state: RootState) => {
  return { state }
}

export default connect(mapStateToProps)(SpyRemover)
