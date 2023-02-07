import { configureStore } from '@reduxjs/toolkit';
import { createWrapper } from 'next-redux-wrapper';

import { slice as sliceAuth } from './sliceAuth';
import { slice as sliceListLandingPage } from './sliceListLandingPage';

const storeCreatorContainer = (preloadedState) => configureStore({
  reducer: {
    [sliceAuth.name]: sliceAuth.reducer,
    [sliceListLandingPage.name]: sliceListLandingPage.reducer,
  },
  devTools: process.env.NODE_ENV !== 'production',
  preloadedState,
});

export default createWrapper(storeCreatorContainer);
