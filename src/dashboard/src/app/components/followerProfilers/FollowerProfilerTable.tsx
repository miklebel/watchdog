import {
  Paper,
  TableContainer,
  TableHead,
  Table as MuiTable,
  TableRow as MuiTableRow,
  TableBody,
  TableCell,
  TableSortLabel,
  TablePagination,
  Skeleton,
  TableFooter
} from '@mui/material'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { AppDispatch, RootState } from '../../redux/store'
import {
  getFollowerProfilersAsync,
  sort,
  limit,
  offset
} from '../../redux/followerProfilers/followerProfilers'
import {
  FollowerProfilerDTO,
  FollowerProfilerOrderColumn,
  FollowerProfilerStatus
} from '@miklebel/watchdog-core'
import moment from 'moment'
import FollowerProfilerRemover from './FollowerProfilerRemover'
import FollowerProfilerEditor from './FollowerProfilerEditor'

interface IProps {
  state: RootState
  dispatch: AppDispatch
}

interface ITableRowProps {
  row: FollowerProfilerDTO
  state: RootState
}

interface ITableRowState {
  opened: boolean
}

class FollowerProfilerTableRow extends Component<ITableRowProps, ITableRowState> {
  constructor(props: ITableRowProps) {
    super(props)

    this.set = this.set.bind(this)
  }

  private set(state: boolean) {
    this.setState({ opened: state })
  }
  render() {
    return (
      <MuiTableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
        <TableCell component="th" scope="row">
          {this.props.state.followerProfilers.loading ? (
            <Skeleton variant="text" />
          ) : (
            this.props.row.name
          )}
        </TableCell>
        <TableCell align="left">{this.props.row.profileName}</TableCell>
        <TableCell align="right">
          {this.props.state.followerProfilers.loading ? (
            <Skeleton variant="text" />
          ) : this.props.row.status === FollowerProfilerStatus.ENABLED ? (
            'Enabled'
          ) : (
            'Disabled'
          )}
        </TableCell>
        <TableCell align="right">
          {this.props.state.followerProfilers.loading ? (
            <Skeleton variant="text" />
          ) : (
            moment(this.props.row.updated).format('MM-DD-YYYY')
          )}
        </TableCell>
        <TableCell align="right">
          {this.props.state.followerProfilers.loading ? (
            <Skeleton variant="text" />
          ) : (
            moment(this.props.row.created).format('MM-DD-YYYY')
          )}
        </TableCell>

        {this.props.state.followerProfilers.loading ? (
          <TableCell align="right">
            <Skeleton variant="text" />
          </TableCell>
        ) : (
          <TableCell align="right" style={{ display: 'flex' }}>
            <FollowerProfilerEditor followerProfiler={this.props.row} />
            <FollowerProfilerRemover followerProfiler={this.props.row} />
          </TableCell>
        )}
      </MuiTableRow>
    )
  }
}

class followerProfilersTable extends Component<IProps> {
  constructor(props: IProps) {
    super(props)
    this.setLimit = this.setLimit.bind(this)
    this.setPage = this.setPage.bind(this)
  }

  async componentDidMount() {
    if (!this.props.state.followerProfilers.rows) {
      await this.props.dispatch(getFollowerProfilersAsync(this.props.state))
    }
  }

  private async toggleSort(column: FollowerProfilerOrderColumn) {
    await this.props.dispatch(sort(column))
    await this.props.dispatch(offset(0))
    await this.props.dispatch(getFollowerProfilersAsync(this.props.state))
  }

  private sortDirection() {
    return this.props.state.followerProfilers.order.ascending ? 'asc' : 'desc'
  }

  private async setLimit(event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    await this.props.dispatch(offset(0))
    await this.props.dispatch(limit(+event.target.value))
    await this.props.dispatch(getFollowerProfilersAsync(this.props.state))
  }

  private async setPage(
    event: React.MouseEvent<HTMLButtonElement, MouseEvent> | null,
    page: number
  ) {
    await this.props.dispatch(offset(page))
    await this.props.dispatch(getFollowerProfilersAsync(this.props.state))
  }

  private rows() {
    return this.props.state.followerProfilers.rows
      ? this.props.state.followerProfilers.rows.map(row => (
          <FollowerProfilerTableRow key={row.id} state={this.props.state} row={row} />
        ))
      : []
  }

  render() {
    return (
      <Paper style={{ paddingTop: '10px' }}>
        <TableContainer component={Paper}>
          <MuiTable aria-label="simple table" size="small">
            <TableHead>
              <MuiTableRow>
                <TableCell>
                  <TableSortLabel
                    direction={this.sortDirection()}
                    active={
                      this.props.state.followerProfilers.order.column ===
                      FollowerProfilerOrderColumn.NAME
                    }
                    onClick={() => this.toggleSort(FollowerProfilerOrderColumn.NAME)}
                  >
                    Follower Profiler Name
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    direction={this.sortDirection()}
                    active={
                      this.props.state.followerProfilers.order.column ===
                      FollowerProfilerOrderColumn.PROFILE
                    }
                    onClick={() => this.toggleSort(FollowerProfilerOrderColumn.PROFILE)}
                  >
                    Profile
                  </TableSortLabel>
                </TableCell>
                <TableCell align="right">
                  <TableSortLabel
                    direction={this.sortDirection()}
                    active={
                      this.props.state.followerProfilers.order.column ===
                      FollowerProfilerOrderColumn.STATUS
                    }
                    onClick={() => this.toggleSort(FollowerProfilerOrderColumn.STATUS)}
                  >
                    Status
                  </TableSortLabel>
                </TableCell>
                <TableCell align="right">
                  <TableSortLabel
                    direction={this.sortDirection()}
                    active={
                      this.props.state.followerProfilers.order.column ===
                      FollowerProfilerOrderColumn.UPDATED
                    }
                    onClick={() => this.toggleSort(FollowerProfilerOrderColumn.UPDATED)}
                  >
                    Updated
                  </TableSortLabel>
                </TableCell>
                <TableCell align="right">
                  <TableSortLabel
                    direction={this.sortDirection()}
                    active={
                      this.props.state.followerProfilers.order.column ===
                      FollowerProfilerOrderColumn.CREATED
                    }
                    onClick={() => this.toggleSort(FollowerProfilerOrderColumn.CREATED)}
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
                <FollowerProfilerEditor
                  style={{ width: 200, alignSelf: 'center', margin: 'auto 0' }}
                />
              </TableCell>

              <TablePagination
                count={this.props.state.followerProfilers.count}
                page={
                  this.props.state.followerProfilers.offset /
                  this.props.state.followerProfilers.limit
                }
                onPageChange={this.setPage}
                rowsPerPage={this.props.state.followerProfilers.limit}
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

export default connect(mapStateToProps)(followerProfilersTable)
