import { createAsyncThunk, createSlice, createSelector } from '@reduxjs/toolkit'
import axios, { Method, AxiosError } from 'axios'
import { SERVER_URL } from '../../constants'
import { AuthenticateUserDTO, UserDTO } from '@miklebel/watchdog-core'
import { history } from '../../router/History'
import { store, RootState } from '../store'
import { authRequest, TokenState } from '../auth/token'

export interface InitialUserState {
  user: UserDTO | null
}

const initialState: InitialUserState = {
  user: null
}

export const getUserAsync = createAsyncThunk(
  'user/get',
  async (state: RootState): Promise<UserDTO> => {
    const userFromState = state.user.user
    if (!userFromState) {
      const user = await authRequest('GET', 'auth/profile', state)
      return user
    }
    return userFromState
  }
)

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(getUserAsync.fulfilled, (state, action) => {
      if (action?.payload) {
        state.user = action.payload
      }
    })
    builder.addCase(getUserAsync.rejected, (state, action) => {
      return
    })
  }
})

export const {} = userSlice.actions

export default userSlice.reducer
