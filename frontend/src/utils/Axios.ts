import axios, { AxiosResponse } from 'axios';

import { getToken, BASE_URL, setAccessToken } from 'config';

const customHttp = axios.create({
  baseURL: BASE_URL,
  timeout: 8000,
});

const parseJwt = (token: string | null) => {
  if (token) return JSON.parse(atob(token.split('.')[1]));
};

export const renewAccessToken = (token: string) => {
  localStorage.removeItem('accessToken');
  setAccessToken(token);
};

export const AuthVerify = () => {
  const decodedAccess = parseJwt(getToken().access);
  const decodedRefresh = parseJwt(getToken().refresh);

  if (decodedAccess?.exp * 1000 < Date.now()) {
    return 'Access Token Expired';
  }

  if (decodedRefresh?.exp * 1000 < Date.now()) {
    return 'Refresh Token Expired';
  }

  return true;
};

export const onFulfilled = async (res: AxiosResponse) => {
  if (AuthVerify() === 'Access Token Expired') {
    const { access: newAccess } = res.data;

    renewAccessToken(newAccess);

    res.config.headers = {
      'Content-Type': `application/json`,
      refresh: getToken().refresh ?? '',
      access: newAccess,
    };

    return await axios(res.config);
  } else return res;
};

customHttp.interceptors.request.use(
  (config) => {
    config.headers = {
      'Content-Type': `application/json`,
      refresh: getToken().refresh ?? '',
      access: getToken().access ?? '',
    };

    return config;
  },
  (err) => Promise.reject(err),
);

customHttp.interceptors.response.use(onFulfilled);

export default customHttp;
