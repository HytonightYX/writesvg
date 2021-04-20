import { Query, useMutation, useQuery } from 'react-query';
import axios from 'axios';
import { axios_get, axios_post } from './axios';
import { Post, QueryKeys, User } from './types';
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

export const usePosts = (tabId: number) =>
  useQuery(['posts', tabId], async () => {
    if (tabId > 0) {
      return axios_get(`note/bytag/${tabId}`);
    }
    const data = await axios_get('note/list');
    return data;
  });

export const useMyPosts = () =>
  useQuery(QueryKeys.MyPosts, async () => {
    const data = await axios_get('note/mine');
    return data;
  });

export const useTags = () =>
  useQuery(QueryKeys.Tags, async () => {
    const data = await axios_get('tag');
    return data;
  });

export const usePostDelete = () =>
  useMutation((id: number) => axios_get(`note/delete/${id}`), {
    onSuccess: (data) => {
      if (data.ok) {
        queryClient.invalidateQueries(QueryKeys.MyPosts);
      }
    },
  });

export const useUser = () =>
  useQuery<User, Error>(QueryKeys.User, async () => {
    const source = CancelToken.source();

    const data = await axios_get('/user/info', {
      cancelToken: source.token,
    });

    return data as User;
  });

export const useHot = () =>
  useQuery(QueryKeys.Hot, async () => {
    const data = axios_get('note/hot');
    return data;
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
    return data as Post;
  });

export const usePotrace = () => useMutation((originUrl: string) => axios_post('note/potrace', { originUrl }));

export const useUserStatus = () =>
  useQuery([QueryKeys.UserStatus], async () => {
    const data = await axios_get('user/status');
    return data;
  });

export const useCreatePost = () => useMutation((newPost: Post) => axios_post('note/add', newPost));

export const useTabList = (tag: string) =>
  useQuery([QueryKeys.Tabs, tag], async () => {
    const data = await axios_get('tags', { tag });
    return data;
  });
