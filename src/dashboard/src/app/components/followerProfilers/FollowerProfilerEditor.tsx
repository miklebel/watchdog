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
import { AppDispatch, RootState } from '../../redux/store'
import {
  CreateOrUpdateFollowerProfilerDTO,
  FollowerProfilerDTO,
  FollowerProfilerStatus
} from '@miklebel/watchdog-core'
import {
  createFollowerProfilerAsync,
  getFollowerProfilersAsync
} from '../../redux/followerProfilers/followerProfilers'

interface IProps {
  state: RootState
  dispatch: AppDispatch
  followerProfiler?: FollowerProfilerDTO
  style?: React.CSSProperties
}

interface Errors {
  name: {
    status: boolean
    message: string
  }
  profileNames: {
    status: boolean
  }
}

interface IState {
  modal: boolean
  followerProfiler: CreateOrUpdateFollowerProfilerDTO
  newFollowerProfiler: boolean
  errors: Errors
}

class FollowerProfilerEditor extends Component<IProps, IState> {
  constructor(props: IProps) {
    super(props)
    this.state = {
      modal: false,
      followerProfiler: this.props.followerProfiler
        ? {
            id: this.props.followerProfiler.id,
            name: this.props.followerProfiler.name,
            profileName: this.props.followerProfiler.profileName,
            status: this.props.followerProfiler.status
          }
        : {
            name: '',
            profileName: '',
            status: FollowerProfilerStatus.ENABLED
          },
      newFollowerProfiler: true,
      errors: {
        name: { status: false, message: '' },
        profileNames: { status: false }
      }
    }
    this.handleOpen = this.handleOpen.bind(this)
    this.handleClose = this.handleClose.bind(this)
    this.onNameChange = this.onNameChange.bind(this)
    this.validateName = this.validateName.bind(this)
    this.profilesInputOnChange = this.profilesInputOnChange.bind(this)
    this.switchOnChange = this.switchOnChange.bind(this)
    this.validateProfileName = this.validateProfileName.bind(this)
    this.saveOnClick = this.saveOnClick.bind(this)
    this.saveButtonStatus = this.saveButtonStatus.bind(this)
    this.setInitialState = this.setInitialState.bind(this)
  }

  private setInitialState() {
    this.setState({
      modal: false,
      followerProfiler: {
        name: '',
        profileName: '',
        status: FollowerProfilerStatus.ENABLED
      },
      newFollowerProfiler: true,
      errors: {
        name: { status: false, message: '' },
        profileNames: { status: false }
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
    state.followerProfiler.name = event.target.value
    this.setState({ ...state })
    this.validateName()
  }

  private validateName(): boolean {
    const state = this.state
    if (this.state.followerProfiler.name.length === 0) {
      state.errors.name = { status: true, message: 'Name can not be empty' }
      this.setState({ ...state })
      return false
    } else {
      state.errors.name = { message: '', status: false }
      this.setState({ ...state })
      return true
    }
  }

  private validateProfileName(): boolean {
    const state = this.state
    const status = !this.state.followerProfiler.profileName.length
    state.errors.profileNames.status = status
    this.setState({ ...state })
    return status
  }

  private profilesInputValue() {
    return this.state.followerProfiler.profileName
  }

  private profilesInputOnChange(event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) {
    const state = this.state
    const { value } = event.target
    state.followerProfiler.profileName = value
    this.validateProfileName()
  }

  private switchOnChange(event: ChangeEvent<HTMLInputElement>) {
    const state = this.state
    state.followerProfiler.status = event.target.checked
      ? FollowerProfilerStatus.ENABLED
      : FollowerProfilerStatus.DISABLED
    this.setState({ ...state })
  }

  private switchValue() {
    return this.state.followerProfiler.status === FollowerProfilerStatus.ENABLED ? true : false
  }

  private async saveOnClick() {
    this.validateProfileName()
    this.validateName()
    if (!this.state.errors.name.status && !this.state.errors.profileNames.status) {
      await this.props.dispatch(
        createFollowerProfilerAsync({ props: this.state.followerProfiler, state: this.props.state })
      )
      this.setInitialState()
      await this.props.dispatch(getFollowerProfilersAsync(this.props.state))
    }
  }

  private saveButtonStatus() {
    const { name, profileNames } = this.state.errors
    return name.status || profileNames.status
  }

  render() {
    return (
      <div style={this.props.style}>
        {this.props.followerProfiler ? (
          <IconButton aria-label="Expand profiles" size="small" onClick={this.handleOpen}>
            <Edit />
          </IconButton>
        ) : (
          <Button onClick={this.handleOpen} startIcon={<Add />}>
            Create a new Follower Profiler
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
              {this.props.followerProfiler
                ? 'Edit Follower Profiler'
                : 'Create new Follower Profiler'}
            </Typography>
            <TextField
              id="standard-basic"
              label="Follower Profiler name"
              onBlur={this.validateName}
              fullWidth
              variant="standard"
              value={this.state.followerProfiler.name}
              error={this.state.errors.name.status}
              helperText={this.state.errors.name.message}
              onChange={this.onNameChange}
            />
            <TextField
              style={{ marginTop: '30px' }}
              variant="standard"
              fullWidth
              maxRows={1}
              onBlur={this.validateProfileName}
              error={this.state.errors.profileNames.status}
              value={this.profilesInputValue()}
              onChange={this.profilesInputOnChange}
              label="Profile name"
              helperText={'write a profile name'}
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

export default connect(mapStateToProps)(FollowerProfilerEditor)
