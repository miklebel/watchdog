import { createSlice } from '@reduxjs/toolkit'
import { deleteSpyAsync, createSpyAsync, getSpiesAsync } from '../spies/spies'
import { getAccountsAsync, deleteAccountAsync, createAccountAsync } from '../accounts/accounts'
import { authenticateAsync } from '../auth/token'
import { getAllSpiesAsync, getTweetsStatsListAsync } from '../feed/feed'
import {
  createFollowerProfilerAsync,
  deleteFollowerProfilerAsync,
  getFollowerProfilersAsync
} from '../followerProfilers/followerProfilers'
import { getUserAsync } from '../user/user'

export interface InitialFeedState {
  errorStatus: boolean
  errorMessage: string
  successStatus: boolean
  successMessage: string
}

const initialState: InitialFeedState = {
  errorStatus: false,
  errorMessage: '',
  successStatus: false,
  successMessage: ''
}

export const alertsSlice = createSlice({
  name: 'alert',
  initialState,
  reducers: {
    showError(state: InitialFeedState, { payload }: { payload: string }) {
      state.errorMessage = payload
      state.errorStatus = true
    },
    showSuccess(state: InitialFeedState, { payload }: { payload: string }) {
      state.successMessage = payload
      state.successStatus = true
    },
    hideError(state: InitialFeedState) {
      state.errorStatus = false
    },
    hideSuccess(state: InitialFeedState) {
      state.successStatus = false
    }
  },
  extraReducers: builder => {
    builder.addCase(deleteSpyAsync.rejected, state => {
      state.errorMessage = `There was a problem removing a spy. Please try again later.`
      state.errorStatus = true
    })

    builder.addCase(deleteSpyAsync.fulfilled, state => {
      state.successMessage = `Spy successfully removed.`
      state.successStatus = true
    })

    builder.addCase(createSpyAsync.rejected, state => {
      state.errorMessage = `There was a problem creating a spy. Please try again later.`
      state.errorStatus = true
    })

    builder.addCase(createSpyAsync.fulfilled, state => {
      state.successMessage = `Spy successfully saved.`
      state.successStatus = true
    })

    builder.addCase(getSpiesAsync.rejected, state => {
      state.errorMessage = `There was a problem getting spy list. Please try again later.`
      state.errorStatus = true
    })

    builder.addCase(getAccountsAsync.rejected, state => {
      state.errorMessage = `There was a problem getting accounts list. Please try again later.`
      state.errorStatus = true
    })

    builder.addCase(deleteAccountAsync.rejected, state => {
      state.errorMessage = `There was a problem removing an account. Please try again later.`
      state.errorStatus = true
    })

    builder.addCase(deleteAccountAsync.fulfilled, state => {
      state.successMessage = `Account successfully removed.`
      state.successStatus = true
    })

    builder.addCase(createAccountAsync.rejected, state => {
      state.errorMessage = `There was a problem creating an account. Please try again later.`
      state.errorStatus = true
    })

    builder.addCase(createAccountAsync.fulfilled, state => {
      state.successMessage = `Account successfully saved.`
      state.successStatus = true
    })

    builder.addCase(authenticateAsync.rejected, state => {
      state.errorMessage = `There was an authentication problem. Please try again with different credentials.`
      state.errorStatus = true
    })

    builder.addCase(getAllSpiesAsync.rejected, state => {
      state.errorMessage = `There was a problem getting spies list. Please try again later.`
      state.errorStatus = true
    })

    builder.addCase(getTweetsStatsListAsync.rejected, state => {
      state.errorMessage = `There was a problem getting tweets statistics. Please try again later.`
      state.errorStatus = true
    })

    builder.addCase(createFollowerProfilerAsync.rejected, state => {
      state.errorMessage = `There was a problem creating a follower profiler. Please try again later.`
      state.errorStatus = true
    })

    builder.addCase(createFollowerProfilerAsync.fulfilled, state => {
      state.successMessage = `Follower profiler successfully saved.`
      state.successStatus = true
    })

    builder.addCase(deleteFollowerProfilerAsync.rejected, state => {
      state.errorMessage = `There was a problem removing a follower profiler. Please try again later.`
      state.errorStatus = true
    })

    builder.addCase(deleteFollowerProfilerAsync.fulfilled, state => {
      state.successMessage = `Follower profiler successfully removed.`
      state.successStatus = true
    })

    builder.addCase(getFollowerProfilersAsync.rejected, state => {
      state.errorMessage = `There was a problem getting follower profilers list. Please try again later.`
      state.errorStatus = true
    })

    builder.addCase(getUserAsync.rejected, state => {
      state.errorMessage = `There was a problem getting user information. Please try again later.`
      state.errorStatus = true
    })
  }
})

export const { showSuccess, showError, hideSuccess, hideError } = alertsSlice.actions

export default alertsSlice.reducer
