import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import {
  CreateOrUpdateFollowerProfilerDTO,
  FollowerProfilerDTO,
  FollowerProfilerListRequestDTO,
  FollowerProfilerListResponseDTO,
  FollowerProfilerOrder,
  FollowerProfilerOrderColumn
} from '@miklebel/watchdog-core'
import { RootState } from '../store'
import { authRequest } from '../auth/token'

export interface InitialFollowerProfilersState {
  rows: FollowerProfilerDTO[] | null
  count: number
  limit: number
  offset: number
  order: FollowerProfilerOrder
  loading: boolean
}

const initialState: InitialFollowerProfilersState = {
  rows: null,
  loading: false,
  count: 0,
  limit: 10,
  offset: 0,
  order: {
    ascending: true,
    column: FollowerProfilerOrderColumn.NAME
  }
}

export const getFollowerProfilersAsync = createAsyncThunk(
  'followerProfiler/get',
  async (state: RootState): Promise<FollowerProfilerListResponseDTO> => {
    const data: FollowerProfilerListRequestDTO = {
      limit: state.followerProfilers.limit,
      offset: state.followerProfilers.offset,
      order: state.followerProfilers.order
    }
    const followerProfilersResponse: Promise<FollowerProfilerListResponseDTO> = await authRequest(
      'POST',
      'followerProfiler/list',
      state,
      data
    )
    return followerProfilersResponse
  }
)

interface CreateFollowerProfilerProps {
  state: RootState
  props: CreateOrUpdateFollowerProfilerDTO
}

interface DeleteFollowerProfilerProps {
  state: RootState
  props: FollowerProfilerDTO
}

export const createFollowerProfilerAsync = createAsyncThunk(
  'followerProfilers/create',
  async (props: CreateFollowerProfilerProps): Promise<FollowerProfilerDTO> => {
    const followerProfilerResponse = await authRequest(
      'POST',
      'followerProfiler/createorupdate',
      props.state,
      props.props
    )
    return followerProfilerResponse
  }
)

export const deleteFollowerProfilerAsync = createAsyncThunk(
  'followerProfilers/delete',
  async (props: DeleteFollowerProfilerProps): Promise<void> => {
    const res = await authRequest('POST', 'followerProfiler/delete', props.state, props.props)
  }
)

export const followerProfilersSlice = createSlice({
  name: 'followerProfilers',
  initialState,
  reducers: {
    sort(state: InitialFollowerProfilersState, action) {
      if (state.order.column === action.payload) {
        state.order.ascending = !state.order.ascending
      } else {
        state.order.column = action.payload
        state.order.ascending = true
      }
    },
    limit(state: InitialFollowerProfilersState, { payload }: { payload: number }) {
      state.limit = payload
    },
    offset(state: InitialFollowerProfilersState, { payload }: { payload: number }) {
      state.offset = payload * state.limit
    }
  },
  extraReducers: builder => {
    builder.addCase(createFollowerProfilerAsync.pending, state => {
      state.loading = true
    })
    builder.addCase(deleteFollowerProfilerAsync.pending, state => {
      state.loading = true
    })
    builder.addCase(getFollowerProfilersAsync.fulfilled, (state, action) => {
      state.rows = action.payload.rows
      state.count = action.payload.count
      state.loading = false
    })
    builder.addCase(getFollowerProfilersAsync.pending, state => {
      state.loading = true
    })
  }
})

export const { sort, limit, offset } = followerProfilersSlice.actions

export default followerProfilersSlice.reducer
