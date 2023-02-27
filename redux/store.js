import { configureStore } from '@reduxjs/toolkit';
import { createWrapper } from 'next-redux-wrapper';

import { slice as sliceItemLandingPage } from './sliceItemLandingPage';
import { slice as sliceListLandingPage } from './sliceListLandingPage';
import { slice as sliceUserDetails } from './sliceUserDetails';

const storeCreatorContainer = (preloadedState) => configureStore({
  reducer: {
    [sliceItemLandingPage.name]: sliceItemLandingPage.reducer,
    [sliceListLandingPage.name]: sliceListLandingPage.reducer,
    [sliceUserDetails.name]: sliceUserDetails.reducer,
  },
  devTools: process.env.NODE_ENV !== 'production',
  preloadedState,
});

export default createWrapper(storeCreatorContainer);
