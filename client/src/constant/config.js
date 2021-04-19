import { qiniu } from '../secret';
import {} from '@ant-design/icons';

export const MENU_MAIN = [
  { title: '发现', path: '/' },
  { title: '我的', path: '/my' },
];

export const FIND_MENU = [
  { title: '所有', key: 'all', icon: '' },
  { title: '标签', key: 'tag', icon: '' },
];

export const SYSTEM_CONFIG = {
  github: {
    // client_id: '907e089d8acd7d59d6ea',
    client_id: '00d361bef1a3c27055fd',
    scope: 'user:email',
  },
  qiniu: {
    AccessKey: '25E0vVorHfwQElXxDFiyo3dydVPg7gpmAy7eRjrt',
    SecretKey: qiniu.SecretKey,
    BASE_QINIU_URL: 'http://qn-noter.yunxi.site/',
    // BASE_QINIU_URL: 'http://qq5kwabpf.hn-bkt.clouddn.com/',
    QINIU_SERVER: 'https://upload-z2.qiniup.com',
  },
};

export const ASSETS = {
  logo64: 'https://i.loli.net/2021/04/05/5ahozSgW68j7ycm.png',
};
