import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { Header } from 'components/header';
import { LoginGuard } from 'components/private-route';

import { Find } from './pages/find';
import { Write } from './pages/write';
import { Profile } from './pages/profile';
import { Login } from './pages/login';
import { Mine } from './pages/my';
import { Note } from './pages/post';
import { Setting } from './pages/setting';

import 'antd/dist/antd.css';
import './style/global.less';

function App() {
  return (
    <div className='app-root'>
      <Header />

      <div className='g-content'>
        <LoginGuard>
          <Switch>
            <Route exact path='/login' component={Login} />
            <Route exact path='/write' component={Write} />
            <Route exact path='/my' component={Mine} />
            <Route exact path='/profile' component={Profile} />
            <Route exact path='/post/:id' component={Note} />
            <Route exact path='/edit/:id' component={Write} />
            <Route exact path='/setting' component={Setting} />

            <Route path='/' component={Find} />
          </Switch>
        </LoginGuard>
      </div>
    </div>
  );
}

export default App;
