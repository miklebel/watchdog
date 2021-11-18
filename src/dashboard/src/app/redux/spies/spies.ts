import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import {
  CreateOrUpdateSpyDTO,
  SpyDTO,
  SpyListRequestDTO,
  SpyListResponseDTO,
  SpyOrder,
  SpyOrderColumn
} from '@miklebel/watchdog-core'
import { RootState } from '../store'
import { authRequest } from '../auth/token'

export interface InitialSpiesState {
  rows: SpyDTO[] | null
  count: number
  limit: number
  offset: number
  order: SpyOrder
  loading: boolean
}

const initialState: InitialSpiesState = {
  rows: null,
  loading: false,
  count: 0,
  limit: 10,
  offset: 0,
  order: {
    ascending: true,
    column: SpyOrderColumn.NAME
  }
}

export const getSpiesAsync = createAsyncThunk(
  'spies/get',
  async (state: RootState): Promise<SpyListResponseDTO> => {
    const data: SpyListRequestDTO = {
      limit: state.spies.limit,
      offset: state.spies.offset,
      order: state.spies.order
    }
    const spiesResponse: Promise<SpyListResponseDTO> = await authRequest(
      'POST',
      'spy/list',
      state,
      data
    )
    return spiesResponse
  }
)

interface CreateSpyProps {
  state: RootState
  props: CreateOrUpdateSpyDTO
}

export const createSpyAsync = createAsyncThunk(
  'spies/create',
  async (props: CreateSpyProps): Promise<SpyDTO> => {
    const spyResponse = await authRequest('POST', 'spy/createorupdate', props.state, props.props)
    return spyResponse
  }
)

export const spiesSlice = createSlice({
  name: 'spies',
  initialState,
  reducers: {
    sort(state: InitialSpiesState, action) {
      if (state.order.column === action.payload) {
        state.order.ascending = !state.order.ascending
      } else {
        state.order.column = action.payload
        state.order.ascending = true
      }
    },
    limit(state: InitialSpiesState, { payload }: { payload: number }) {
      state.limit = payload
    },
    offset(state: InitialSpiesState, { payload }: { payload: number }) {
      state.offset = payload * state.limit
    }
  },
  extraReducers: builder => {
    // builder.addCase(createSpyAsync.fulfilled, async () => {})
    builder.addCase(createSpyAsync.pending, state => {
      state.loading = true
    })
    builder.addCase(getSpiesAsync.fulfilled, (state, action) => {
      state.rows = action.payload.rows
      state.count = action.payload.count

      console.log({ state })
      state.loading = false
    })
    builder.addCase(getSpiesAsync.pending, state => {
      state.loading = true
    })
  }
})

export const { sort, limit, offset } = spiesSlice.actions

export default spiesSlice.reducer
