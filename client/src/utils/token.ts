/**
 * 游览器原生 base64 编码
 * @param jwt
 * @return {string}
 */
export const encodeJWT = (jwt: string) => `Basic ${window.btoa(jwt + ':')}`;
