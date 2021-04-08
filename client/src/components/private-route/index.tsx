import React, { useState } from 'react';
import queryString from 'query-string';
import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { Redirect, Route } from 'react-router-dom';
import { useAuth } from 'utils/auth';
import { useUser } from 'src/utils/request';

export interface Props {
  children: React.ReactNode;
}

export function LoginGuard({ children }: Props) {
  const { isLoading, isFetching } = useUser();

  const [hasToken] = useState(() => {
    const token = localStorage.getItem('token');
    return !!token;
  });

  return (
    <>
      {hasToken && isLoading ? (
        <div className='g-login_guard'>
          <Spin indicator={<LoadingOutlined style={{ fontSize: 48 }} />} tip='拉取用户信息...' />
        </div>
      ) : (
        children
      )}
    </>
  );
}

// A wrapper for <Route> that redirects to the login
// screen if you're not yet authenticated.
export function PrivateRoute({ children, ...rest }) {
  let auth = useAuth();
  return (
    <Route
      {...rest}
      render={({ location }) =>
        auth.user ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: '/login',
              state: { from: location },
            }}
          />
        )
      }
    />
  );
}
