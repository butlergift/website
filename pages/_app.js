/* eslint-disable react/prop-types */
/* eslint-disable react/jsx-props-no-spreading */
import { Provider } from 'react-redux';
import { NextUIProvider } from '@nextui-org/react';

import '../styles/globals.css';
import LayoutWrapper from '../components/LayoutWrapper';
import AuthContextProvider from '../components/shared/auth/AuthContext';
import storeWrapper from '../redux/store';

function MyApp({ Component, ...rest }) {
  const { store, props } = storeWrapper.useWrappedStore(rest);
  const { pageProps } = props;
  return (
    <NextUIProvider>
      <Provider store={store}>
        <AuthContextProvider>
          <LayoutWrapper>
            <Component {...pageProps} />
          </LayoutWrapper>
        </AuthContextProvider>
      </Provider>
    </NextUIProvider>
  );
}

export default MyApp;
