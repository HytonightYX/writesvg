import React from 'react';
import { Divider } from 'antd';
import { BarChartOutlined, UserOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { useUser, useUserStatus } from 'src/utils/request';
import './style.less';

export function Profile() {
  const { data: user, isLoading } = useUser();
  const { data: status } = useUserStatus();
  if (isLoading) {
    return <div>loading</div>;
  }

  return (
    <div className='g-profile'>
      <div className='m-container'>
        <div className='user-content'>
          <div className='user-panel'>
            <div className='user-icon'>
              <img src={user?.avatar} alt='' />
            </div>

            <div className='user-info'>
              <div className='m-name'>
                <span className='username'>{user?.userName}</span>

                <Link to='/setting'>
                  <button className='btn-edit'>编辑</button>
                </Link>
              </div>

              <Divider />

              <div className='m-status'>BIO: {user?.desc}</div>
            </div>
          </div>
        </div>
        <div className='right-side'>
          <div className='title'>成就</div>
          <div className='time'>
            <BarChartOutlined />
            文章 {status?.noteNum} · 被赞 {status?.likeNum} · 被收藏 {status?.collectNum}
          </div>
          <div className='time'>
            <UserOutlined type='user' />
            您成为本站会员 1 天
          </div>
        </div>
      </div>
    </div>
  );
}
