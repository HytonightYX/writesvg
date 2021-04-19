import React, { useRef } from 'react';
import { GithubOutlined, LoadingOutlined } from '@ant-design/icons';
import { GITHUB_LOGIN } from '../../constant/api';
import OauthPopup from 'react-oauth-popup';
import { login, useUser } from 'src/utils/request';
import { Button } from 'antd';
import { useQueryClient } from 'react-query';
import { QueryKeys } from 'src/utils/types';
import './style.less';
import { Redirect, useLocation } from 'react-router-dom';
import qs from 'query-string';
import styled from 'styled-components';

const Loading = styled.div`
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  position: absolute;
  left: 0;
  top: 0;
  background-color: #f5f5f5;
  font-size: 64px;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  .content {
    margin-top: 12px;
    font-size: 32px;
  }
`;

export function Login() {
  let { search } = useLocation();
  const { code } = qs.parse(search);

  if (code) {
    return (
      <Loading>
        <LoadingOutlined />
        <span className='content'>正在从 GitHub 拉取用户数据</span>
      </Loading>
    );
  }

  const ref = useRef('');
  const { isSuccess } = useUser();
  const queryClient = useQueryClient();

  const onCode = async (code: string) => {
    console.log('执行 onCode');
    ref.current = await login(code);
    queryClient.invalidateQueries(QueryKeys.User);
  };

  if (isSuccess) {
    return <Redirect to='/' />;
  }

  return (
    <div className='g-login'>
      <div className='m-login'>
        {isSuccess ? (
          <div>已登录</div>
        ) : (
          <OauthPopup
            url={GITHUB_LOGIN}
            onCode={onCode}
            onClose={() => {}}
            title='Github Login'
            width={500}
            height={700}
          >
            <Button
              type='primary'
              style={{
                height: 38,
                width: '100%',
                background: '#24292e',
                borderColor: '#24292e',
              }}
            >
              <GithubOutlined />
              Github 一键登录
            </Button>
          </OauthPopup>
        )}
      </div>
    </div>
  );
}
