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
  IconButton
} from '@mui/material'
import { Add, Edit } from '@mui/icons-material'
import React, { Component, ChangeEvent } from 'react'
import { connect } from 'react-redux'
import { AppDispatch, RootState } from '../../redux/store'
import { CreateOrUpdateSpyDTO, SpyDTO, SpyStatus } from '@miklebel/watchdog-core'
import { createSpyAsync, getSpiesAsync } from '../../redux/spies/spies'

interface IProps {
  state: RootState
  dispatch: AppDispatch
  spy?: SpyDTO
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
  spy: CreateOrUpdateSpyDTO
  newSpy: boolean
  errors: Errors
}

class SpyEditor extends Component<IProps, IState> {
  constructor(props: IProps) {
    super(props)
    this.state = {
      modal: false,
      spy: this.props.spy
        ? {
            id: this.props.spy.id,
            name: this.props.spy.name,
            profileNames: this.props.spy.profileNames,
            scrapingRateMaximum: this.props.spy.scrapingRateMaximum,
            scrapingRateMinimum: this.props.spy.scrapingRateMinimum,
            status: this.props.spy.status
          }
        : {
            name: '',
            profileNames: [],
            scrapingRateMaximum: 5,
            scrapingRateMinimum: 3,
            status: SpyStatus.ENABLED
          },
      newSpy: true,
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
    this.sliderOnChange = this.sliderOnChange.bind(this)
    this.switchOnChange = this.switchOnChange.bind(this)
    this.validateProfileNames = this.validateProfileNames.bind(this)
    this.saveOnClick = this.saveOnClick.bind(this)
    this.saveButtonStatus = this.saveButtonStatus.bind(this)
    this.setInitialState = this.setInitialState.bind(this)
  }

  private setInitialState() {
    this.setState({
      modal: false,
      spy: {
        name: '',
        profileNames: [],
        scrapingRateMaximum: 5,
        scrapingRateMinimum: 3,
        status: SpyStatus.ENABLED
      },
      newSpy: true,
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
    state.spy.name = event.target.value
    this.setState({ ...state })
    this.validateName()
  }

  private validateName(): boolean {
    const state = this.state
    if (this.state.spy.name.length === 0) {
      state.errors.name = { status: true, message: 'Name can not be empty' }
      this.setState({ ...state })
      return false
    } else {
      state.errors.name = { message: '', status: false }
      this.setState({ ...state })
      return true
    }
  }

  private validateProfileNames(): boolean {
    const state = this.state
    const status =
      !this.state.spy.profileNames.length || this.state.spy.profileNames.every(name => !name.length)
    state.errors.profileNames.status = status
    this.setState({ ...state })
    return status
  }

  private profilesInputValue() {
    return this.state.spy.profileNames.join('\n')
  }

  private profilesInputOnChange(event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) {
    const state = this.state
    const { value } = event.target
    state.spy.profileNames = value
      .split('\n')
      .reduce((prev: string[], curr) => [...prev, ...curr.split(' ')], [])
    this.setState({ ...state })
    this.validateProfileNames()
  }
  private sliderValue() {
    return [this.state.spy.scrapingRateMinimum, this.state.spy.scrapingRateMaximum]
  }

  private sliderOnChange(_event: any, newValue: number | number[], _activeThumb: any) {
    const state = this.state
    state.spy.scrapingRateMinimum = typeof newValue === 'object' ? newValue[0] : 0
    state.spy.scrapingRateMaximum = typeof newValue === 'object' ? newValue[1] : 0
    this.setState({ ...state })
  }

  private switchOnChange(event: ChangeEvent<HTMLInputElement>) {
    const state = this.state
    state.spy.status = event.target.checked ? SpyStatus.ENABLED : SpyStatus.DISABLED
    this.setState({ ...state })
  }

  private switchValue() {
    return this.state.spy.status === SpyStatus.ENABLED ? true : false
  }

  private async saveOnClick() {
    this.validateProfileNames()
    this.validateName()
    if (!this.state.errors.name.status && !this.state.errors.profileNames.status) {
      await this.props.dispatch(createSpyAsync({ props: this.state.spy, state: this.props.state }))
      this.setInitialState()
      await this.props.dispatch(getSpiesAsync(this.props.state))
    }
  }

  private saveButtonStatus() {
    const { name, profileNames } = this.state.errors
    return name.status || profileNames.status
  }

  render() {
    return (
      <div style={this.props.style}>
        {this.props.spy ? (
          <IconButton aria-label="Expand profiles" size="small" onClick={this.handleOpen}>
            <Edit />
          </IconButton>
        ) : (
          <Button onClick={this.handleOpen} startIcon={<Add />}>
            Create a new spy
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
              {this.props.spy ? 'Edit spy' : 'Create new spy'}
            </Typography>
            <TextField
              id="standard-basic"
              label="Spy name"
              onBlur={this.validateName}
              fullWidth
              variant="standard"
              value={this.state.spy.name}
              error={this.state.errors.name.status}
              helperText={this.state.errors.name.message}
              onChange={this.onNameChange}
            />
            <TextField
              style={{ marginTop: '30px' }}
              variant="standard"
              fullWidth
              maxRows={4}
              onBlur={this.validateProfileNames}
              multiline
              error={this.state.errors.profileNames.status}
              value={this.profilesInputValue()}
              onChange={this.profilesInputOnChange}
              label="Creators list"
              helperText={'write a list of profile names separated by space or newline'}
            />

            <Typography variant="h6" style={{ marginTop: '30px' }} component="h6">
              Adjust scraping rate
            </Typography>

            <Slider
              //   style={{ marginTop: '20px' }}
              value={this.sliderValue()}
              onChange={this.sliderOnChange}
              valueLabelDisplay="auto"
              marks
              max={10}
              min={1}
            />
            <Typography
              variant="caption"
              color={'ActiveCaption'}
              style={{ marginTop: -10 }}
              component="h6"
            >
              select maximum and minimum time in seconds for scraper to stay on each page
            </Typography>
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

export default connect(mapStateToProps)(SpyEditor)
