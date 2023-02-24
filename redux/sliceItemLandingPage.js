/* eslint-disable no-param-reassign */
// import Promise from 'bluebird';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { HYDRATE } from 'next-redux-wrapper';

import * as firebase from '../firebase/index';
import * as localStorage from '../utils/localStorage';

const CACHE_GET_USER_ITEM = 60; // 1min
const SLICE_NAME = 'itemLandingPage';
const INITIAL_STATE = {
  error: '',
  item: {},
  itemId: '',
  loading: false,
};

const resetState = (state) => {
  Object.keys(state).forEach((k) => { state[k] = undefined; });
  Object.keys(INITIAL_STATE).forEach((k) => { state[k] = INITIAL_STATE[k]; });
};

const setItem = (state, action) => {
  state.item = action.payload.item;
  state.itemId = action.payload.itemId;
};

const getUserItemById = createAsyncThunk(`${SLICE_NAME}/getUserItemById`, async (args) => {
  const key = `${SLICE_NAME}:getUserItemById:${args.itemId}`;
  const item = localStorage.getItem(key, []);
  if (Object.keys(item).length > 0) {
    return { itemId: args.itemId, item };
  }
  const remoteItem = await firebase.getUserItemById(args);
  localStorage.setItem(key, remoteItem, CACHE_GET_USER_ITEM);
  return { itemId: args.itemId, item: remoteItem };
});

export const slice = createSlice({
  name: SLICE_NAME,
  initialState: INITIAL_STATE,
  reducers: {
    resetState,
    setItem,

    // Special reducer for hydrating the state
    extraReducers: {
      [HYDRATE]: (state, action) => ({
        ...state,
        ...action.payload[SLICE_NAME],
      }),
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getUserItemById.pending, (state) => {
        state.loading = true;
        state.error = '';
      })
      .addCase(getUserItemById.fulfilled, (state, action) => {
        state.loading = false;
        if (action?.payload?.error) {
          state.error = action.payload.error.message;
          return;
        }
        state.item = action.payload.item;
        state.itemId = action.payload.itemId;
      })
      .addCase(getUserItemById.rejected, (state, action) => {
        state.loading = false;
        state.error = action?.error?.message || action?.payload || '';
      });
  },
});

export const actions = { ...slice.actions, getUserItemById };
export default slice.reducer;
