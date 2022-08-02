export const BASE_URL = 'https://wesalad.net';

const API = {
  checkToken: `${BASE_URL}/api/accounts/`,
  search: `${BASE_URL}/api/accounts/search`,
  login: `${BASE_URL}/api/users/google`,
  signup: `${BASE_URL}/api/users/signup`,
  callback: `${BASE_URL}/api/users/google/login`,

  getToken: () => {
    const access = localStorage.getItem('accessToken');
    const refresh = localStorage.getItem('refreshToken');

    return { access, refresh };
  },
};

export const setAccessToken = (token: string) =>
  localStorage.setItem('accessToken', token);

export const TINYMCE_API_KEY =
  'zxuiph9yiunvdp85dyzooockfmnnka538tzip74drjnbvoia';

export default API;
