import { useQuery } from 'react-query';
import { axios_get } from './axios';
import { QueryKeys, User } from './types';

export async function login(code: string) {
  const data = await axios_get('token/github?code=' + code);
  const { token } = data;

  // presist token
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
    const userinfo = await axios_get('user/info');
    return userinfo as User;
  });

export const useToken = (code: string | null, enabled: boolean) =>
  useQuery<string, Error>(
    QueryKeys.Token,
    async () => {
      const data = await axios_get('token/github?code=' + code);
      const { token } = data;
      return token;
    },
    {
      // 需要手动触发
      enabled,
      retry: 0,
      // 8 小时后重新 fetch (token 过期时间)
      staleTime: 1000 * 60 * 60 * 8,
    },
  );

export const usePost = (id: number) =>
  useQuery([QueryKeys.Post, id], async () => {
    const data = await axios_get(`note/${id}`);
    return data;
  });
