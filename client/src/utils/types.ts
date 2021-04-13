export interface User {
  userName: string;
  email: string;
  githubId: number;
  avatar?: string;
  realName?: string;
  desc?: string;
}

export enum QueryKeys {
  Token = 'token',
  User = 'user',
  Post = 'post',
  UserStatus = 'user-status',
  QiniuToken = 'qiniu-token',
  Tabs = 'tabs',
}
