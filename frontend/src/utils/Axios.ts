import axios, { AxiosResponse } from 'axios';

import getToken, { BASE_URL, setAccessToken } from 'config';

const parseJwt = (token: string | null) => {
  if (token) return JSON.parse(atob(token.split('.')[1]));
};

export const renewAccessToken = (token: string) => {
  localStorage.removeItem('accessToken');
  setAccessToken(token);
};

export const AuthVerify = () => {
  const decodedAccess = parseJwt(getToken.getToken().access);
  const decodedRefresh = parseJwt(getToken.getToken().refresh);

  if (decodedAccess?.exp * 1000 < Date.now()) {
    return 'Access Token Expired';
  }

  if (decodedRefresh?.exp * 1000 < Date.now()) {
    return 'Refresh Token Expired';
  }

  return true;
};

const customHttp = axios.create({
  baseURL: BASE_URL,
  timeout: 8000,
  headers: {
    'Content-Type': `application/json`,
    access: getToken.getToken().access ?? '',
    refresh: getToken.getToken().refresh ?? '',
  },
});

export const onFulfilled = async (res: AxiosResponse) => {
  if (AuthVerify() === 'Access Token Expired') {
    const { access: newAccess } = res.data;

    renewAccessToken(newAccess);

    res.config.headers = {
      'Content-Type': `application/json`,
      refresh: getToken.getToken().refresh ?? '',
      access: newAccess,
    };

    return await axios(res.config);
  } else return res;
};

customHttp.interceptors.response.use(onFulfilled);

export default customHttp;
