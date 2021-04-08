export interface User {
  userName: string;
  email: string;
  githubId: number;
  avatar: string;
}

export enum QueryKeys {
  Token = 'token',
  User = 'user',
  Post = 'post',
}
