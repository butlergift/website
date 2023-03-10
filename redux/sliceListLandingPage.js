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
  items: [],
  listDetails: {},
  loading: false,
};

const resetState = (state) => {
  Object.keys(state).forEach((k) => { state[k] = undefined; });
  Object.keys(INITIAL_STATE).forEach((k) => { state[k] = INITIAL_STATE[k]; });
};

const getUserListItemsById = createAsyncThunk(`${SLICE_NAME}/getUserListItemsById`, async (args) => {
  const key = `${SLICE_NAME}:getUserListItemsById:${args.listId}`;
  const listItems = localStorage.getItem(key, {});
  if (Object.keys(listItems).length > 0) {
    return listItems;
  }
  const remoteListItems = await firebase.getUserListItemsById(args);
  localStorage.setItem(key, remoteListItems, CACHE_GET_USER_LIST);
  return remoteListItems;
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
      .addCase(getUserListItemsById.pending, (state) => {
        state.loading = true;
        state.error = '';
      })
      .addCase(getUserListItemsById.fulfilled, (state, action) => {
        state.loading = false;
        if (action?.payload?.error) {
          state.error = action.payload.error.message;
          return;
        }
        Object.keys(action.payload).forEach((k) => { state[k] = action.payload[k]; });
      })
      .addCase(getUserListItemsById.rejected, (state, action) => {
        state.loading = false;
        state.error = action?.error?.message || action?.payload || '';
      });
  },
});

export const actions = { ...slice.actions, getUserListItemsById };
export default slice.reducer;
