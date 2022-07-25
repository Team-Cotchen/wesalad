export const BASE_URL = 'https://wesalad.net';

const API = {
  checkToken: `${BASE_URL}/accounts/`,
  search: `${BASE_URL}/accounts/search`,
  login: `${BASE_URL}/users/google`,
  signup: `${BASE_URL}/users/signup`,

  getToken: () => {
    const access = localStorage.getItem('accessToken');
    const refresh = localStorage.getItem('refreshToken');

    return { access, refresh };
  },
};

export const TINYMCE_API_KEY =
  'zxuiph9yiunvdp85dyzooockfmnnka538tzip74drjnbvoia';

export default API;
