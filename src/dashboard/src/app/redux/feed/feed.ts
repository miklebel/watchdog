import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import {
  GetTweetsStatsListDTO,
  SpyDTO,
  SpyListRequestDTO,
  SpyListResponseDTO,
  SpyOrderColumn,
  TweetsStatsListResponse
} from '@miklebel/watchdog-core'
import { RootState } from '../store'
import { authRequest } from '../auth/token'
import moment from 'moment'

export interface InitialFeedState {
  profile: string | null
  loading: boolean
  spies: SpyDTO[] | null
  count: number | null
  stats: {
    rows: {
      stats: { likes: string; quotes: string; retweets: string; time: string }[]
      username: string
      id: string
    }[]
    count: number
  }
  date: string
  limit: number
  offset: number
}

const initialState: InitialFeedState = {
  profile: null,
  loading: false,
  spies: null,
  count: null,
  limit: 10,
  offset: 0,
  stats: {
    count: 0,
    rows: []
  },
  date: moment().format('YYYY-MM-DD')
}

export const getAllSpiesAsync = createAsyncThunk(
  'tweetsStats/get/spies',
  async (state: RootState): Promise<SpyListResponseDTO> => {
    const data: SpyListRequestDTO = {
      limit: 1000,
      offset: 0,
      order: { column: SpyOrderColumn.NAME, ascending: true }
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

export const getTweetsStatsListAsync = createAsyncThunk(
  'tweetsStats/get',
  async (state: RootState): Promise<TweetsStatsListResponse> => {
    if (!state.feed.profile) throw 'Supply method with twitter username'
    const data: GetTweetsStatsListDTO = {
      limit: state.feed.limit,
      offset: state.feed.offset,
      username: state.feed.profile,
      date: state.feed.date
    }
    const tweetsStatsResponse: Promise<TweetsStatsListResponse> = await authRequest(
      'POST',
      'feed/tweetsStats',
      state,
      data
    )
    return tweetsStatsResponse
  }
)

export const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {
    setProfile(state: InitialFeedState, { payload }: { payload: string }) {
      state.profile = payload
    },
    setDate(state: InitialFeedState, { payload }: { payload: string }) {
      state.date = payload
    },
    limit(state: InitialFeedState, { payload }: { payload: number }) {
      state.limit = payload
    },
    offset(state: InitialFeedState, { payload }: { payload: number }) {
      state.offset = payload * state.limit
    }
  },
  extraReducers: builder => {
    builder.addCase(getAllSpiesAsync.fulfilled, (state, action) => {
      state.spies = action.payload.rows
      state.loading = false
    })
    builder.addCase(getAllSpiesAsync.pending, state => {
      state.loading = true
    })
    builder.addCase(getTweetsStatsListAsync.fulfilled, (state, action) => {
      state.stats.rows = action.payload.rows
      state.stats.count = action.payload.count
      state.loading = false
    })
    builder.addCase(getTweetsStatsListAsync.pending, state => {
      state.loading = true
    })
  }
})

export const { setProfile, setDate, limit, offset } = feedSlice.actions

export default feedSlice.reducer
