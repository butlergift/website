/* eslint-disable no-param-reassign */
// import Promise from 'bluebird';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { HYDRATE } from 'next-redux-wrapper';

import * as firebase from '../firebase/index';
import * as localStorage from '../utils/localStorage';

const CACHE_GET_USER_INFO = 60 * 60 * 24 * 30; // 30days
const SLICE_NAME = 'userDetails';
const INITIAL_STATE = {
  error: '',
  user: null,
  loading: false,
};

const resetState = (state) => {
  Object.keys(state).forEach((k) => { state[k] = undefined; });
  Object.keys(INITIAL_STATE).forEach((k) => { state[k] = INITIAL_STATE[k]; });
  localStorage.removeItem(SLICE_NAME);
};

const setUser = (state, action) => {
  state.user = {
    ...(state.user || {}),
    ...action.payload,
  };
};

const setUserDetails = (state, action) => {
  Object.keys(action.payload)
    .forEach((k) => {
      if (action.payload[k]) {
        state.user[k] = action.payload[k];
      }
    });

  // Update localStorage with userDetails (not whole user) only since that's what we are saving here
  if (action?.payload?.birthday) {
    localStorage.setItem(SLICE_NAME, { birthday: action.payload.birthday }, CACHE_GET_USER_INFO);
  }
};

const getUserDetails = createAsyncThunk(`${SLICE_NAME}/getUserDetails`, async (args) => {
  const userDetails = localStorage.getItem(SLICE_NAME, {});
  if (Object.keys(userDetails).length > 0) {
    return userDetails;
  }
  const remoteUserDetails = await firebase.getUserDetails(args);
  localStorage.setItem(SLICE_NAME, remoteUserDetails, CACHE_GET_USER_INFO);
  return remoteUserDetails;
});

export const slice = createSlice({
  name: SLICE_NAME,
  initialState: INITIAL_STATE,
  reducers: {
    resetState,
    setUser,
    setUserDetails,

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
      .addCase(getUserDetails.pending, (state) => {
        state.loading = true;
        state.error = '';
      })
      .addCase(getUserDetails.fulfilled, (state, action) => {
        state.loading = false;
        if (action?.payload?.error) {
          state.error = action.payload.error.message;
          return;
        }
        setUserDetails(state, action);
      })
      .addCase(getUserDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action?.error?.message || action?.payload || '';
      });
  },
});

export const actions = { ...slice.actions, getUserDetails };
export default slice.reducer;
