import { Button, Form, Input, message } from 'antd';
import { computed } from 'mobx';
import { inject, observer } from 'mobx-react';
import React, { useCallback } from 'react';
import './style.less';
import { axios_post } from '../../utils/axios';
import { useUser, useUserUpdate } from 'src/utils/request';

const { Item } = Form;
const { TextArea } = Input;

export function Setting() {
  const { data: user, isLoading } = useUser();
  const { mutate: updateUser } = useUserUpdate();

  const submit = useCallback((data) => {
    updateUser(data);
  }, []);

  return (
    <div className='g-setting'>
      <div className='m-title'>账号设置</div>

      <Form onFinish={submit} layout='vertical' className='m-setting-form'>
        <div className='m-form'>
          <Item name='userName' required label='用户名' initialValue={user?.userName ?? ''}>
            <Input size='large' placeholder='用户名' />
          </Item>

          <Item name='email' required label='常用邮箱' initialValue={user?.email ?? ''}>
            <Input size='large' placeholder='常用邮箱' />
          </Item>

          <Item name='realName' label='真实姓名' initialValue={user?.realName ?? ''}>
            <Input size='large' placeholder='真实姓名' />
          </Item>

          <Item name='desc' required label='个人简介' initialValue={user?.desc ?? ''}>
            <TextArea size='large' placeholder='个人简介' autoSize={{ minRows: 2 }} />
          </Item>
        </div>

        <div style={{ textAlign: 'center' }}>
          <Button size='large' className='setting-save' htmlType='submit' loading={isLoading}>
            保存
          </Button>
        </div>
      </Form>
    </div>
  );
}
