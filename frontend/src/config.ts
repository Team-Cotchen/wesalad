export const BASE_URL = 'https://wesalad.net';
export const BASE_URL_TEST =
  'https://2d5cac18-c275-4959-bf2e-a67a96b96520.mock.pstmn.io/';

const API = {
  checkToken: `${BASE_URL}/accounts/`,
  search: `${BASE_URL}/accounts/search`,
  // login: `${BASE_URL_TEST}/user/signIn`,
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
