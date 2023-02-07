/* eslint-disable no-param-reassign */
// import Promise from 'bluebird';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { HYDRATE } from 'next-redux-wrapper';

import * as firebase from '../firebase/index';

const SLICE_NAME = 'listLandingPage';
const INITIAL_STATE = {
  error: '',
  list: [],
  listId: '',
  step: '',
};

const resetState = (state) => {
  Object.keys(state).forEach((k) => { state[k] = undefined; });
  Object.keys(INITIAL_STATE).forEach((k) => { state[k] = INITIAL_STATE[k]; });
};

const getUserList = createAsyncThunk(`${SLICE_NAME}/getUserList`, async (args) => firebase.getListItemsById(args));

export const slice = createSlice({
  name: SLICE_NAME,
  initialState: INITIAL_STATE,
  reducers: {
    resetState,

    // Special reducer for hydrating the state
    extraReducers: {
      [HYDRATE]: (state, action) => ({
        ...state,
        ...action.payload,
      }),
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getUserList.pending, (state) => {
        resetState(state);
        state.step = 'pending';
        state.error = '';
      })
      .addCase(getUserList.fulfilled, (state, action) => {
        resetState(state);
        if (action?.payload?.error) {
          state.step = 'rejected';
          state.error = action.payload.error.message;
          return;
        }
        state.list = action.payload;
        state.step = 'fulfilled';
      })
      .addCase(getUserList.rejected, (state, action) => {
        resetState(state);
        state.step = 'rejected';
        state.error = action?.error?.message || action?.payload || '';
      });
  },
});

export const actions = { ...slice.actions, getUserList };
export default slice.reducer;
