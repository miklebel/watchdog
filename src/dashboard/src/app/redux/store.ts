import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit'
import tokenReducer from './auth/token'
import userReducer from './user/user'

export const store = configureStore({
  reducer: {
    token: tokenReducer,
    user: userReducer
  }
})

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>
