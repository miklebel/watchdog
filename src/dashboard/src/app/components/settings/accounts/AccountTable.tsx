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
  TableFooter,
  Snackbar,
  Alert
} from '@mui/material'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { AppDispatch, RootState } from '../../../redux/store'
import { getAccountsAsync, sort, limit, offset } from '../../../redux/accounts/accounts'
import { AccountDTO, AccountOrderColumn, AccountStatus } from '@miklebel/watchdog-core'
import moment from 'moment'
import AccountRemover from './AccountRemover'
import AccountEditor from './AccountEditor'

interface IProps {
  state: RootState
  dispatch: AppDispatch
}

interface ITableRowProps {
  row: AccountDTO
  state: RootState
}

interface ITableRowState {
  opened: boolean
}

class AccountTableRow extends Component<ITableRowProps, ITableRowState> {
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
        <TableCell align="left">{this.props.row.username}</TableCell>
        <TableCell align="right">
          {this.props.state.accounts.loading ? (
            <Skeleton variant="text" />
          ) : this.props.row.status === AccountStatus.ENABLED ? (
            'Enabled'
          ) : this.props.row.status === AccountStatus.DISABLED ? (
            'Disabled'
          ) : (
            'Requires Update'
          )}
        </TableCell>
        <TableCell align="right">
          {this.props.state.accounts.loading ? (
            <Skeleton variant="text" />
          ) : (
            moment(this.props.row.updated).format('MM-DD-YYYY')
          )}
        </TableCell>
        <TableCell align="right">
          {this.props.state.accounts.loading ? (
            <Skeleton variant="text" />
          ) : (
            moment(this.props.row.created).format('MM-DD-YYYY')
          )}
        </TableCell>

        {this.props.state.accounts.loading ? (
          <TableCell align="right">
            <Skeleton variant="text" />
          </TableCell>
        ) : (
          <TableCell align="right" style={{ display: 'flex' }}>
            <AccountEditor account={this.props.row} />

            <AccountRemover account={this.props.row} />
          </TableCell>
        )}
      </MuiTableRow>
    )
  }
}

class AccountsTable extends Component<IProps> {
  constructor(props: IProps) {
    super(props)

    this.setLimit = this.setLimit.bind(this)
    this.setPage = this.setPage.bind(this)
  }

  async componentDidMount() {
    if (!this.props.state.accounts.rows) {
      await this.props.dispatch(getAccountsAsync(this.props.state))
    }
  }

  private async toggleSort(column: AccountOrderColumn) {
    await this.props.dispatch(sort(column))
    await this.props.dispatch(offset(0))
    await this.props.dispatch(getAccountsAsync(this.props.state))
  }

  private sortDirection() {
    return this.props.state.accounts.order.ascending ? 'asc' : 'desc'
  }

  private async setLimit(event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    await this.props.dispatch(offset(0))
    await this.props.dispatch(limit(+event.target.value))
    await this.props.dispatch(getAccountsAsync(this.props.state))
  }

  private async setPage(
    event: React.MouseEvent<HTMLButtonElement, MouseEvent> | null,
    page: number
  ) {
    await this.props.dispatch(offset(page))
    await this.props.dispatch(getAccountsAsync(this.props.state))
  }

  private rows() {
    return this.props.state.accounts.rows
      ? this.props.state.accounts.rows.map(row => (
          <AccountTableRow key={row.id} state={this.props.state} row={row} />
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
                    active={this.props.state.accounts.order.column === AccountOrderColumn.USERNAME}
                    onClick={() => this.toggleSort(AccountOrderColumn.USERNAME)}
                  >
                    Username
                  </TableSortLabel>
                </TableCell>
                <TableCell align="right">
                  <TableSortLabel
                    direction={this.sortDirection()}
                    active={this.props.state.accounts.order.column === AccountOrderColumn.STATUS}
                    onClick={() => this.toggleSort(AccountOrderColumn.STATUS)}
                  >
                    Status
                  </TableSortLabel>
                </TableCell>
                <TableCell align="right">
                  <TableSortLabel
                    direction={this.sortDirection()}
                    active={this.props.state.accounts.order.column === AccountOrderColumn.UPDATED}
                    onClick={() => this.toggleSort(AccountOrderColumn.UPDATED)}
                  >
                    Updated
                  </TableSortLabel>
                </TableCell>
                <TableCell align="right">
                  <TableSortLabel
                    direction={this.sortDirection()}
                    active={this.props.state.accounts.order.column === AccountOrderColumn.CREATED}
                    onClick={() => this.toggleSort(AccountOrderColumn.CREATED)}
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
                <AccountEditor style={{ width: 200, alignSelf: 'center', margin: 'auto 0' }} />
              </TableCell>
              <TablePagination
                count={this.props.state.accounts.count}
                page={this.props.state.accounts.offset / this.props.state.accounts.limit}
                onPageChange={this.setPage}
                rowsPerPage={this.props.state.accounts.limit}
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

export default connect(mapStateToProps)(AccountsTable)
