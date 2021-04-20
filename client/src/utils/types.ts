export interface User {
  userName: string;
  email: string;
  githubId: number;
  avatar?: string;
  realName?: string;
  desc?: string;
}

export interface Block {
  _id: number;
  originUrl?: string;
  svgUrl?: string;
}

export interface Post {
  id: number;
  title: string;
  cover?: string;
  likeNum?: number;
  collectNum?: number;
  User: Record<string, unknown>;
  blocks: any[];
  tags: any[];
}

export enum QueryKeys {
  Token = 'token',
  User = 'user',
  Post = 'post',
  UserStatus = 'user-status',
  QiniuToken = 'qiniu-token',
  Tabs = 'tabs',
  MyPosts = 'my-posts',
  Hot = 'hot-posts',
  Tags = 'tags',
}
