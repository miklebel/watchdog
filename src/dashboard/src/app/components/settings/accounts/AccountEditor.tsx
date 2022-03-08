import {
  Box,
  Button,
  Modal,
  TextField,
  Typography,
  Switch,
  FormControlLabel,
  Grid,
  IconButton
} from '@mui/material'
import { Add, Edit } from '@mui/icons-material'
import React, { Component, ChangeEvent } from 'react'
import { connect } from 'react-redux'
import { AppDispatch, RootState } from '../../../redux/store'
import { CreateOrUpdateAccountDTO, AccountDTO, AccountStatus } from '@miklebel/watchdog-core'
import { createAccountAsync, getAccountsAsync } from '../../../redux/accounts/accounts'
import { showError, showSuccess } from '../../../redux/alerts/alerts'

interface IProps {
  state: RootState
  dispatch: AppDispatch
  account?: AccountDTO
  style?: React.CSSProperties
}

interface Errors {
  username: {
    status: boolean
    message: string
  }
  password: {
    status: boolean
  }
}

interface IState {
  modal: boolean
  account: CreateOrUpdateAccountDTO
  newAccount: boolean
  errors: Errors
}

class AccountEditor extends Component<IProps, IState> {
  constructor(props: IProps) {
    super(props)
    this.state = {
      modal: false,
      account: this.props.account
        ? {
            id: this.props.account.id,
            username: this.props.account.username,
            password: '',
            status: this.props.account.status
          }
        : {
            username: '',
            password: '',
            status: AccountStatus.ENABLED
          },
      newAccount: true,
      errors: {
        username: { status: false, message: '' },
        password: { status: false }
      }
    }
    this.handleOpen = this.handleOpen.bind(this)
    this.handleClose = this.handleClose.bind(this)
    this.onNameChange = this.onNameChange.bind(this)
    this.validateName = this.validateName.bind(this)
    this.passwordInputOnChange = this.passwordInputOnChange.bind(this)
    this.switchOnChange = this.switchOnChange.bind(this)
    this.validatePassword = this.validatePassword.bind(this)
    this.saveOnClick = this.saveOnClick.bind(this)
    this.saveButtonStatus = this.saveButtonStatus.bind(this)
    this.setInitialState = this.setInitialState.bind(this)
  }

  private setInitialState() {
    this.setState({
      modal: false,
      account: {
        username: '',
        password: '',
        status: AccountStatus.ENABLED
      },
      newAccount: true,
      errors: {
        username: { status: false, message: '' },
        password: { status: false }
      }
    })
  }

  private handleOpen() {
    this.setState({ ...this.state, modal: true })
  }

  private handleClose() {
    this.setState({ ...this.state, modal: false })
  }

  private onNameChange(event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) {
    const state = this.state
    state.account.username = event.target.value
    this.setState({ ...state })
    this.validateName()
  }

  private validateName(): boolean {
    const state = this.state
    if (this.state.account.username.length === 0) {
      state.errors.username = { status: true, message: 'Name can not be empty' }
      this.setState({ ...state })
      return false
    } else {
      state.errors.username = { message: '', status: false }
      this.setState({ ...state })
      return true
    }
  }

  private validatePassword(): boolean {
    const state = this.state
    const status = !this.state.account.password.length
    state.errors.password.status = status
    this.setState({ ...state })
    return status
  }

  private passwordInputValue() {
    return this.state.account.password
  }

  private passwordInputOnChange(event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) {
    const state = this.state
    const { value } = event.target
    state.account.password = value
    this.validatePassword()
  }

  private switchOnChange(event: ChangeEvent<HTMLInputElement>) {
    const state = this.state
    state.account.status = event.target.checked ? AccountStatus.ENABLED : AccountStatus.DISABLED
    this.setState({ ...state })
  }

  private switchValue() {
    return this.state.account.status === AccountStatus.ENABLED ? true : false
  }

  private async saveOnClick() {
    this.validatePassword()
    this.validateName()
    if (!this.state.errors.username.status && !this.state.errors.password.status) {
      try {
        await this.props.dispatch(
          createAccountAsync({ props: this.state.account, state: this.props.state })
        )
        this.props.dispatch(
          showSuccess(`Account succesfully ${!this.state.account.id ? 'created' : 'modified'}.`)
        )
      } catch (error) {
        alert(error)
        this.props.dispatch(
          showError(
            `There was an error ${
              !this.state.account.id ? 'creating' : 'modifying'
            } account. Please try again later.`
          )
        )
      }

      this.setInitialState()
      await this.props.dispatch(getAccountsAsync(this.props.state))
    }
  }

  private saveButtonStatus() {
    const { username, password } = this.state.errors
    return username.status || password.status
  }

  render() {
    return (
      <div style={this.props.style}>
        {this.props.account ? (
          <IconButton aria-label="Expand profiles" size="small" onClick={this.handleOpen}>
            <Edit />
          </IconButton>
        ) : (
          <Button onClick={this.handleOpen} startIcon={<Add />}>
            Create a new Account
          </Button>
        )}
        <Modal
          open={this.state.modal}
          onClose={this.handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '95%',
              maxWidth: 600,
              maxHeight: '100%',
              bgcolor: 'background.paper',
              border: '2px solid #000',
              boxShadow: 24,
              p: 4
            }}
          >
            <Typography id="modal-modal-title" variant="h6" component="h2">
              {this.props.account ? 'Edit Account' : 'Create new Account'}
            </Typography>
            <TextField
              id="standard-basic"
              label="Account username"
              onBlur={this.validateName}
              fullWidth
              variant="standard"
              value={this.state.account.username}
              error={this.state.errors.username.status}
              helperText={this.state.errors.username.message}
              onChange={this.onNameChange}
            />
            <TextField
              style={{ marginTop: '30px' }}
              variant="standard"
              fullWidth
              type={'password'}
              maxRows={1}
              onBlur={this.validatePassword}
              error={this.state.errors.password.status}
              value={this.passwordInputValue()}
              onChange={this.passwordInputOnChange}
              label="Account password"
              helperText={'write a password'}
            />

            <Grid container>
              <Grid item xs={12} md={9} style={{ marginTop: 30 }}>
                <FormControlLabel
                  label={this.switchValue() ? 'Enabled' : 'Disabled'}
                  control={<Switch onChange={this.switchOnChange} checked={this.switchValue()} />}
                />
              </Grid>
              <Grid item xs={12} md={3} style={{ marginTop: 30 }}>
                <Button
                  disabled={this.saveButtonStatus()}
                  onClick={this.saveOnClick}
                  variant="contained"
                  fullWidth
                >
                  Save
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Modal>
      </div>
    )
  }
}

const mapStateToProps = (state: RootState) => {
  return { state }
}

export default connect(mapStateToProps)(AccountEditor)
