import React, { useRef, useState } from 'react';
import { Button, Divider } from 'antd';
import { GithubOutlined } from '@ant-design/icons';
import { GITHUB_LOGIN } from '../../constant/api';
import OauthPopup from 'react-oauth-popup';
import { login, useToken, useUser } from 'src/utils/request';
import './style.less';
import { useQueryClient } from 'react-query';
import { QueryKeys } from 'src/utils/types';

export function Login() {
  const ref = useRef('');
  const token = ref.current;
  const {} = useToken(token, !!token);
  const { data, refetch } = useUser();
  const queryClient = useQueryClient();

  const onCode = async (code: string) => {
    ref.current = await login(code);
    queryClient.invalidateQueries(QueryKeys.User, {
      refetchInactive: false,
    });
    // refetch();
  };

  return (
    <div className='g-login'>
      <div className='m-login'>
        {data ? (
          <div>登陆过的就别来凑热闹了</div>
        ) : (
          <OauthPopup
            url={GITHUB_LOGIN}
            onCode={onCode}
            onClose={() => {}}
            title='Github Login'
            width={500}
            height={700}
          >
            <Button>
              <GithubOutlined />
              Github 一键登录
            </Button>
          </OauthPopup>
        )}
      </div>
    </div>
  );
}
