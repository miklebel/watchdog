import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import {
  CreateOrUpdateAccountDTO,
  AccountDTO,
  AccountListRequestDTO,
  AccountListResponseDTO,
  AccountOrder,
  AccountOrderColumn
} from '@miklebel/watchdog-core'
import { RootState } from '../store'
import { authRequest } from '../auth/token'

export interface InitialAccountsState {
  rows: AccountDTO[] | null
  count: number
  limit: number
  offset: number
  order: AccountOrder
  loading: boolean
}

const initialState: InitialAccountsState = {
  rows: null,
  loading: false,
  count: 0,
  limit: 10,
  offset: 0,
  order: {
    ascending: true,
    column: AccountOrderColumn.USERNAME
  }
}

export const getAccountsAsync = createAsyncThunk(
  'accounts/get',
  async (state: RootState): Promise<AccountListResponseDTO> => {
    const data: AccountListRequestDTO = {
      limit: state.accounts.limit,
      offset: state.accounts.offset,
      order: state.accounts.order
    }
    const accountsResponse: Promise<AccountListResponseDTO> = await authRequest(
      'POST',
      'account/list',
      state,
      data
    )
    return accountsResponse
  }
)

interface CreateAccountProps {
  state: RootState
  props: CreateOrUpdateAccountDTO
}

interface DeleteAccountProps {
  state: RootState
  props: AccountDTO
}

export const createAccountAsync = createAsyncThunk(
  'accounts/create',
  async (props: CreateAccountProps, { rejectWithValue, fulfillWithValue }): Promise<void> => {
    try {
      const accountResponse = await authRequest(
        'POST',
        'account/createorupdate',
        props.state,
        props.props
      )
      return accountResponse
    } catch (error) {
      throw error
    }
  }
)

export const deleteAccountAsync = createAsyncThunk(
  'accounts/delete',
  async (props: DeleteAccountProps, { rejectWithValue, fulfillWithValue }): Promise<void> => {
    try {
      const res = await authRequest('POST', 'account/delete', props.state, props.props)
      return res
    } catch (error) {
      throw error
    }
  }
)

export const accountsSlice = createSlice({
  name: 'accounts',
  initialState,
  reducers: {
    sort(state: InitialAccountsState, action) {
      if (state.order.column === action.payload) {
        state.order.ascending = !state.order.ascending
      } else {
        state.order.column = action.payload
        state.order.ascending = true
      }
    },
    limit(state: InitialAccountsState, { payload }: { payload: number }) {
      state.limit = payload
    },
    offset(state: InitialAccountsState, { payload }: { payload: number }) {
      state.offset = payload * state.limit
    }
  },
  extraReducers: builder => {
    // builder.addCase(createAccountAsync.fulfilled, async () => {})
    builder.addCase(createAccountAsync.pending, state => {
      state.loading = true
    })
    builder.addCase(deleteAccountAsync.pending, state => {
      state.loading = true
    })
    builder.addCase(getAccountsAsync.fulfilled, (state, action) => {
      state.rows = action.payload.rows
      state.count = action.payload.count
      state.loading = false
    })
    builder.addCase(getAccountsAsync.pending, state => {
      state.loading = true
    })
  }
})

export const { sort, limit, offset } = accountsSlice.actions

export default accountsSlice.reducer
