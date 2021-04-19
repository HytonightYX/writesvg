import React, { useCallback } from 'react';
import { Dropdown, Menu } from 'antd';
import { Icon, Menu as SemanticMenu } from 'semantic-ui-react';
import { Link, useHistory, useLocation } from 'react-router-dom';
import { ASSETS, MENU_MAIN } from '../../constant/config';
import { Container } from './styled';
import { useUser } from 'src/utils/request';

export function Header() {
  const { data: user } = useUser();
  let location = useLocation();

  const signout = useCallback(() => {
    localStorage.removeItem('token');
    window.location.href = '/';
  }, []);

  const isActive = (path: string) => {
    return path === location.pathname;
  };

  return (
    <Container>
      <div className='m-nav'>
        <SemanticMenu inverted pointing secondary size='large'>
          <div className='m-logo'>
            <img src={ASSETS.logo64} alt='' />
          </div>
          {MENU_MAIN.map((item) => (
            <Link to={item.path} key={item.title}>
              <SemanticMenu.Item name={item.title} active={isActive(item.path)} />
            </Link>
          ))}
        </SemanticMenu>

        <div className='nav-right'>
          <div>
            <Icon className='m-icon' name='search' />
          </div>

          {user ? (
            <Dropdown
              overlay={
                <Menu>
                  <Menu.Item>
                    <Link to='/profile'>
                      <div>个人主页</div>
                    </Link>
                  </Menu.Item>
                  <Menu.Item>
                    <Link to='/setting'>账号设置</Link>
                  </Menu.Item>
                  <Menu.Item>
                    <a rel='noopener noreferrer' href='#' onClick={() => signout()}>
                      退出登录
                    </a>
                  </Menu.Item>
                </Menu>
              }
              placement='bottomCenter'
              overlayClassName='m-header-dropdown'
            >
              <div className='user-icon'>
                <img src={user.avatar} alt='' />
              </div>
            </Dropdown>
          ) : (
            <Link to='/login'>
              <button className='m-login_btn'>登录</button>
            </Link>
          )}
        </div>
      </div>
    </Container>
  );
}
