/* eslint-disable no-param-reassign */
// import Promise from 'bluebird';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { HYDRATE } from 'next-redux-wrapper';

import * as firebase from '../firebase/index';
import * as localStorage from '../utils/localStorage';

const CACHE_GET_USER_LIST = 60; // 1min
const SLICE_NAME = 'listLandingPage';
const INITIAL_STATE = {
  error: '',
  list: [],
  listId: '',
  loading: false,
};

const resetState = (state) => {
  Object.keys(state).forEach((k) => { state[k] = undefined; });
  Object.keys(INITIAL_STATE).forEach((k) => { state[k] = INITIAL_STATE[k]; });
};

const getUserList = createAsyncThunk(`${SLICE_NAME}/getUserList`, async (args) => {
  const key = `${SLICE_NAME}:getUserList:${args.listId}`;
  const list = localStorage.getItem(key, []);
  if (list.length > 0) {
    return { listId: args.listId, list };
  }
  const remoteList = await firebase.getListItemsById(args);
  localStorage.setItem(key, remoteList, CACHE_GET_USER_LIST);
  return { listId: args.listId, list: remoteList };
});

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
        state.loading = true;
        state.error = '';
      })
      .addCase(getUserList.fulfilled, (state, action) => {
        state.loading = false;
        if (action?.payload?.error) {
          state.error = action.payload.error.message;
          return;
        }
        state.list = action.payload.list;
        state.listId = action.payload.listId;
      })
      .addCase(getUserList.rejected, (state, action) => {
        state.loading = false;
        state.error = action?.error?.message || action?.payload || '';
      });
  },
});

export const actions = { ...slice.actions, getUserList };
export default slice.reducer;
