import { createAsyncThunk, createSlice, createAction } from '@reduxjs/toolkit'
import axios, { Method } from 'axios'
import { SERVER_URL } from '../../constants'
import { AuthenticateUserDTO } from '@miklebel/watchdog-core'
import { history } from '../../router/History'
import { RootState } from '../store'

export interface TokenState {
  value: string | null
}

const initialState: TokenState = {
  value: localStorage.getItem('jwtToken')
}
export const authRequest = async (method: Method, url: string, state: RootState, data?: any) => {
  try {
    const token = state.token.value

    const response = await axios.request({
      method,
      url: SERVER_URL + url,
      data,
      headers: { Authorization: `Bearer ${token}` }
    })

    return response.data
  } catch (error: any) {
    if (typeof error === 'object' && error.response.status === 401) {
      history.push('/login')
      throw error
    }
    throw error
  }
}

export const authenticateAsync = createAsyncThunk(
  'token/Authenticate',
  async (payload: AuthenticateUserDTO) => {
    const { password, username } = payload
    const response = await axios.post(SERVER_URL + 'auth/login', { username, password }, {})
    return response.data
  }
)

export const logout = createAction('token/logout')

export const tokenSlice = createSlice({
  name: 'token',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(authenticateAsync.fulfilled, (state, action) => {
      if (action?.payload?.access_token) {
        state.value = action.payload.access_token
        localStorage.setItem('jwtToken', action.payload.access_token)
        setTimeout(() => history.push('/'), 0)
      }
    })
    builder.addCase(logout, state => {
      state.value = null
      localStorage.removeItem('jwtToken')
      history.push('/login')
    })
  }
})

// export const {} = tokenSlice.actions

export default tokenSlice.reducer
