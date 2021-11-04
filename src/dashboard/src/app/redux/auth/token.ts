import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'
import { SERVER_URL } from '../../constants'
import { AuthenticateUserDTO } from '@miklebel/watchdog-core'

export interface TokenState {
  value: string
}

const initialState: TokenState = {
  value: ''
}

const getToken = async (username: string, password: string) => {
  const response = await axios.post(SERVER_URL + 'auth/login', { username, password })
  return response.data
}

export const authenticateAsync = createAsyncThunk(
  'token/Authenticate',
  async (payload: AuthenticateUserDTO) => {
    const { password, username } = payload
    const response = await getToken(username, password)

    return response
  }
)

export const tokenSlice = createSlice({
  name: 'token',
  initialState,
  reducers: {
    logoff: (state: TokenState) => {
      state.value = ''
    }
  },
  extraReducers: builder => {
    builder.addCase(authenticateAsync.fulfilled, (state, action) => {
      state.value = action.payload.access_token
      localStorage.setItem('jwtToken', action.payload.access_token)
    })
  }
})

export const { logoff } = tokenSlice.actions

export default tokenSlice.reducer
