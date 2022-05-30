import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { UserDTO } from '@miklebel/watchdog-core'
import { RootState } from '../store'
import { authRequest } from '../auth/token'

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
  }
})

export default userSlice.reducer
