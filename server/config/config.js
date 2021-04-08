module.exports = {
  env: 'dev',
  database: {
    dbName: 'noter',
    host: '101.37.14.191',
    port: 3306,
    user: 'noter',
    pwd: 'noter',
  },
  security: {
    secretKey: 'abcdefg', // 秘钥
    expiresIn: 60 * 60 * 24 * 30, // 令牌过期时间 一个月
  },
  github: {
    // client_id: '907e089d8acd7d59d6ea',
    client_id: '00d361bef1a3c27055fd',
    scope: 'user:email',
    // client_secret: '92a7d98f5aa002ec45f5bfac5e97edcf714c5afe'
    client_secret: '9a7efb5b81836dbf6863cff95aff47d2e746110d',
  },
};
