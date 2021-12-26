import {
  Box,
  Typography,
  Paper,
  TableContainer,
  TableHead,
  Table as MuiTable,
  TableRow as MuiTableRow,
  TableBody,
  TableCell,
  IconButton,
  TableSortLabel,
  Collapse,
  Chip,
  TablePagination,
  Skeleton,
  Grid,
  TableFooter
} from '@mui/material'
import { KeyboardArrowUp, KeyboardArrowDown } from '@mui/icons-material'
import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import { AppDispatch, RootState } from '../redux/store'
import { getSpiesAsync, sort, limit, offset } from '../redux/spies/spies'
import { SpyDTO, SpyOrderColumn, SpyStatus } from '@miklebel/watchdog-core'
import moment from 'moment'
import SpyEditor from './SpyEditor'
import SpyRemover from './SpyRemover'

interface IProps {
  state: RootState
  dispatch: AppDispatch
}

interface ITableProps {
  rows: SpyDTO[] | null
}
interface ITableRowProps {
  row: SpyDTO
  state: RootState
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
      <Fragment>
        <MuiTableRow>
          <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={7}>
            <Collapse in={this.props.opened} timeout="auto" unmountOnExit>
              <Box sx={{ margin: 1 }}>
                <Typography variant="h6" gutterBottom component="div">
                  Profiles
                </Typography>
                {this.props.profiles.map(profile => (
                  <Chip key={profile} style={{ marginRight: 5 }} label={profile} />
                ))}
              </Box>
            </Collapse>
          </TableCell>
        </MuiTableRow>
      </Fragment>
    )
  }
}

class TableRow extends Component<ITableRowProps, ITableRowState> {
  constructor(props: ITableRowProps) {
    super(props)
    this.state = {
      opened: false
    }

    this.set = this.set.bind(this)
  }

  private set(state: boolean) {
    this.setState({ opened: state })
  }
  render() {
    return (
      <Fragment>
        <MuiTableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
          <TableCell component="th" scope="row">
            {this.props.state.spies.loading ? <Skeleton variant="text" /> : this.props.row.name}
          </TableCell>
          <TableCell align="right">
            <IconButton
              aria-label="Expand profiles"
              size="small"
              onClick={() => this.set(!this.state.opened)}
            >
              {this.state.opened ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
            </IconButton>
          </TableCell>
          <TableCell align="right">
            {this.props.state.spies.loading ? (
              <Skeleton />
            ) : (
              `${this.props.row.scrapingRateMinimum} - ${this.props.row.scrapingRateMaximum}`
            )}
          </TableCell>
          <TableCell align="right">
            {this.props.state.spies.loading ? (
              <Skeleton variant="text" />
            ) : this.props.row.status === SpyStatus.ENABLED ? (
              'Enabled'
            ) : (
              'Disabled'
            )}
          </TableCell>
          <TableCell align="right">
            {this.props.state.spies.loading ? (
              <Skeleton variant="text" />
            ) : (
              moment(this.props.row.updated).format('MM-DD-YYYY')
            )}
          </TableCell>
          <TableCell align="right">
            {this.props.state.spies.loading ? (
              <Skeleton variant="text" />
            ) : (
              moment(this.props.row.created).format('MM-DD-YYYY')
            )}
          </TableCell>

          {this.props.state.spies.loading ? (
            <TableCell align="right">
              <Skeleton variant="text" />
            </TableCell>
          ) : (
            <TableCell align="right" style={{ display: 'flex' }}>
              <SpyEditor spy={this.props.row} />
              <SpyRemover spy={this.props.row} />
            </TableCell>
          )}
        </MuiTableRow>
        <ProfilesTableRow opened={this.state.opened} profiles={this.props.row.profileNames} />
      </Fragment>
    )
  }
}

class SpiesTable extends Component<IProps> {
  constructor(props: IProps) {
    super(props)
    this.state = {
      hello: 'world'
    }
    this.setLimit = this.setLimit.bind(this)
    this.setPage = this.setPage.bind(this)
  }

  async componentDidMount() {
    if (!this.props.state.spies.rows) {
      await this.props.dispatch(getSpiesAsync(this.props.state))
    }
  }

  private async toggleSort(column: SpyOrderColumn) {
    await this.props.dispatch(sort(column))
    await this.props.dispatch(offset(0))
    await this.props.dispatch(getSpiesAsync(this.props.state))
  }

  private sortDirection() {
    return this.props.state.spies.order.ascending ? 'asc' : 'desc'
  }

  private async setLimit(event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    await this.props.dispatch(offset(0))
    await this.props.dispatch(limit(+event.target.value))
    await this.props.dispatch(getSpiesAsync(this.props.state))
  }

  private async setPage(
    event: React.MouseEvent<HTMLButtonElement, MouseEvent> | null,
    page: number
  ) {
    await this.props.dispatch(offset(page))
    await this.props.dispatch(getSpiesAsync(this.props.state))
  }

  private rows() {
    return this.props.state.spies.rows
      ? this.props.state.spies.rows.map(row => (
          <TableRow key={row.id} state={this.props.state} row={row} />
        ))
      : []
  }

  render() {
    return (
      <Paper style={{ margin: 10 }}>
        <TableContainer component={Paper}>
          <MuiTable aria-label="simple table" size="small">
            <TableHead>
              <MuiTableRow>
                <TableCell>
                  <TableSortLabel
                    direction={this.sortDirection()}
                    active={this.props.state.spies.order.column === SpyOrderColumn.NAME}
                    onClick={() => this.toggleSort(SpyOrderColumn.NAME)}
                  >
                    Spy Name
                  </TableSortLabel>
                </TableCell>
                <TableCell align="right">Profiles</TableCell>
                <TableCell align="right">Rate</TableCell>
                <TableCell align="right">
                  <TableSortLabel
                    direction={this.sortDirection()}
                    active={this.props.state.spies.order.column === SpyOrderColumn.STATUS}
                    onClick={() => this.toggleSort(SpyOrderColumn.STATUS)}
                  >
                    Status
                  </TableSortLabel>
                </TableCell>
                <TableCell align="right">
                  <TableSortLabel
                    direction={this.sortDirection()}
                    active={this.props.state.spies.order.column === SpyOrderColumn.UPDATED}
                    onClick={() => this.toggleSort(SpyOrderColumn.UPDATED)}
                  >
                    Updated
                  </TableSortLabel>
                </TableCell>
                <TableCell align="right">
                  <TableSortLabel
                    direction={this.sortDirection()}
                    active={this.props.state.spies.order.column === SpyOrderColumn.CREATED}
                    onClick={() => this.toggleSort(SpyOrderColumn.CREATED)}
                  >
                    Created
                  </TableSortLabel>
                </TableCell>
                <TableCell align="right">Actions</TableCell>
              </MuiTableRow>
            </TableHead>
            <TableBody>{this.rows()}</TableBody>
            <TableFooter style={{ alignItems: 'center', justifyContent: 'center' }}>
              <TableCell>
                <SpyEditor style={{ width: 200, alignSelf: 'center', margin: 'auto 0' }} />
              </TableCell>

              <TablePagination
                count={this.props.state.spies.count}
                page={this.props.state.spies.offset / this.props.state.spies.limit}
                onPageChange={this.setPage}
                rowsPerPage={this.props.state.spies.limit}
                onRowsPerPageChange={this.setLimit}
              />
            </TableFooter>
          </MuiTable>
        </TableContainer>
      </Paper>
    )
  }
}

const mapStateToProps = (state: RootState) => {
  return { state }
}

export default connect(mapStateToProps)(SpiesTable)
