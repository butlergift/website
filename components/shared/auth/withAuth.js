/* eslint-disable react/jsx-props-no-spreading */
import React, { useEffect, useState } from 'react';
import router from 'next/router';
import { Loading } from '@nextui-org/react';

import Colors from '../../colors';
import { auth } from '../../../firebase/index';

const withAuth = (Component) => (props) => {
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    auth.onAuthStateChanged((authUser) => {
      if (!authUser) {
        setLoading(true);
        router.push('/signin');
        return;
      }
      setLoading(false);
    });
  }, []);

  return (
    <div>
      {
        isLoading ? (
          <Loading
            css={{
              display: 'flex',
              justifyContent: 'center',
              margin: '50px',
            }}
            loadingCss={{
              $$loadingSize: '100px',
              $$loadingBorder: '10px',
              $$loadingColor: Colors.primary,
            }}
          />
        ) : (
          <Component {...props} />
        )
      }
    </div>
  );
};

export default withAuth;
