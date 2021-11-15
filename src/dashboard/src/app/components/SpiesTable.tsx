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
  Paper,
  Skeleton,
  TableContainer,
  TableHead,
  Table as MuiTable,
  TableRow as MuiTableRow,
  TableBody,
  TableCell,
  IconButton,
  Collapse,
  Chip
} from '@mui/material'
import { Add, KeyboardArrowUp, KeyboardArrowDown } from '@mui/icons-material'
import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import { AppDispatch, RootState } from '../redux/store'
import { getSpiesAsync } from '../redux/spies/spies'
import { SpyDTO, SpyStatus } from '@miklebel/watchdog-core'

interface IProps {
  state: RootState
  dispatch: AppDispatch
}

interface IState {
  hello: 'world'
}

interface ITableProps {
  rows: SpyDTO[] | null
}
interface ITableRowProps {
  row: SpyDTO
}

interface IProfilesTableRowProps {
  profiles: string[]
  opened: boolean
}

interface ITableRowState {
  opened: boolean
}

class ProfilesTableRow extends Component<IProfilesTableRowProps> {
  constructor(props: IProfilesTableRowProps) {
    super(props)
  }
  render() {
    return (
      <MuiTableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={this.props.opened} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" gutterBottom component="div">
                Profiles
              </Typography>
              {this.props.profiles.map(profile => (
                <Chip style={{ marginRight: 5 }} label={profile} />
              ))}
            </Box>
          </Collapse>
        </TableCell>
      </MuiTableRow>
    )
  }
}

class TableRow extends Component<ITableRowProps, ITableRowState> {
  constructor(props: ITableRowProps) {
    super(props)
    this.state = {
      opened: false
    }

    this.toggleOpen = this.toggleOpen.bind(this)
  }

  private toggleOpen() {
    this.setState({ opened: !this.state.opened })
  }
  render() {
    return (
      <Fragment>
        <MuiTableRow
          key={this.props.row.id}
          sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
        >
          <TableCell component="th" scope="row">
            {this.props.row.name}
          </TableCell>
          <TableCell align="right">
            <IconButton aria-label="Expand profiles" size="small" onClick={this.toggleOpen}>
              {this.state.opened ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
            </IconButton>
          </TableCell>
          <TableCell align="right">{`${this.props.row.scrapingRateMinimum} - ${this.props.row.scrapingRateMaximum}`}</TableCell>
          <TableCell align="right">
            {this.props.row.status === SpyStatus.ENABLED ? 'Enabled' : 'Disabled'}
          </TableCell>
        </MuiTableRow>
        <ProfilesTableRow opened={this.state.opened} profiles={this.props.row.profileNames} />
      </Fragment>
    )
  }
}

class SpiesTable extends Component<IProps, IState> {
  constructor(props: IProps) {
    super(props)
    console.log('table mounted')
    this.state = {
      hello: 'world'
    }
  }

  async componentDidMount() {
    if (!this.props.state.spies.rows) {
      await this.props.dispatch(getSpiesAsync(this.props.state))
    }
  }

  private Table(props: ITableProps) {
    return (
      <TableContainer component={Paper}>
        <MuiTable sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <MuiTableRow>
              <TableCell>Spy Name</TableCell>
              <TableCell align="right">Profiles</TableCell>
              <TableCell align="right">Rate</TableCell>
              <TableCell align="right">Status</TableCell>
            </MuiTableRow>
          </TableHead>
          <TableBody>{props.rows ? props.rows.map(row => <TableRow row={row} />) : []}</TableBody>
        </MuiTable>
      </TableContainer>
    )
  }

  render() {
    return (
      <Paper style={{ margin: 10 }}>
        <this.Table rows={this.props.state.spies.rows} />
      </Paper>
    )
  }
}

const mapStateToProps = (state: RootState) => {
  return { state }
}

export default connect(mapStateToProps)(SpiesTable)
