import { useMutation, useQuery } from 'react-query';
import { axios_get, axios_post } from './axios';
import axios from 'axios';
import { QueryKeys, User } from './types';
import { queryClient } from 'src/query-client';

const { CancelToken } = axios;

export async function login(code: string) {
  console.log('获得 code');
  const data = await axios_get('token/github?code=' + code);
  const { token } = data;

  // 将 token 存储本地
  window.localStorage.setItem('token', token);

  return token;
}

export const usePosts = () =>
  useQuery('posts', async () => {
    const data = await axios_get('note/list');
    return data;
  });

export const useUser = () =>
  useQuery<User, Error>(QueryKeys.User, async () => {
    const source = CancelToken.source();

    const data = await axios_get('/user/info', {
      cancelToken: source.token,
    });

    return data as User;
  });

export const useUserUpdate = () =>
  useMutation((payload: User) => axios_post('user/modify', payload), {
    onSuccess: () => {
      queryClient.invalidateQueries(QueryKeys.User);
    },
  });

export const useQiniuToken = () =>
  useQuery<string, Error>(QueryKeys.QiniuToken, async () => {
    const data = await axios_get('token/qiniu');
    const { token } = data;
    return token;
  });

export const usePost = (id: number) =>
  useQuery([QueryKeys.Post, id], async () => {
    const data = await axios_get(`note/${id}`);
    return data;
  });

export const useUserStatus = () =>
  useQuery([QueryKeys.UserStatus], async () => {
    const data = await axios_get('user/status');
    return data;
  });

export const useCreatePost = () => useMutation((newPost) => axios_post('note/add', newPost));

export const useTabList = (tag: string) =>
  useQuery([QueryKeys.Tabs, tag], async () => {
    const data = await axios_get('tags', { tag });
    return data;
  });
