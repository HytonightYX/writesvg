import React, { createContext, useContext, useState } from 'react';

/** For more details on
 * `authContext`, `ProvideAuth`, `useAuth` and `useProvideAuth`
 * refer to: https://usehooks.com/useAuth/
 */
const authContext = createContext({});

// TODO: remove
const fakeAuth = {
  isAuthenticated: false,
  signin(cb: any) {
    fakeAuth.isAuthenticated = true;
    setTimeout(cb, 100); // fake async
  },
  signout(cb: any) {
    fakeAuth.isAuthenticated = false;
    setTimeout(cb, 100); // fake async
  },
};

export function ProvideAuth({ children }: { children: React.ReactNode }) {
  const auth = useProvideAuth();
  return <authContext.Provider value={auth}>{children}</authContext.Provider>;
}

export function useAuth() {
  return useContext(authContext);
}

export function useProvideAuth() {
  const [user, setUser] = useState<string>();

  const signin = (cb: any) => {
    return fakeAuth.signin(() => {
      setUser('user');
      cb();
    });
  };

  const signout = (cb: any) => {
    return fakeAuth.signout(() => {
      setUser(null);
      cb();
    });
  };

  return {
    user,
    signin,
    signout,
  };
}
