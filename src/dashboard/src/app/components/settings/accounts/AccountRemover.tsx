import {
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContentText,
  DialogActions,
  DialogContent
} from '@mui/material'
import { Delete } from '@mui/icons-material'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { AppDispatch, RootState } from '../../../redux/store'
import { AccountDTO } from '@miklebel/watchdog-core'
import { deleteAccountAsync, getAccountsAsync } from '../../../redux/accounts/accounts'

interface IProps {
  state: RootState
  dispatch: AppDispatch
  account: AccountDTO
}

interface IState {
  modal: boolean
}

class AccountRemover extends Component<IProps, IState> {
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
    await this.props.dispatch(
      deleteAccountAsync({ state: this.props.state, props: this.props.account })
    )

    this.handleClose()
    await this.props.dispatch(getAccountsAsync(this.props.state))
  }

  render() {
    return (
      <div>
        <IconButton aria-label="Expand profiles" size="small" onClick={this.handleOpen}>
          <Delete />
        </IconButton>
        <Dialog
          open={this.state.modal}
          onClose={this.handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
          onKeyUp={this.keyPress}
        >
          <DialogTitle>{`Delete "${this.props.account.username}"?`}</DialogTitle>
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

export default connect(mapStateToProps)(AccountRemover)
