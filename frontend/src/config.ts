export const BASE_URL = 'https://wesalad.net';

const API = {
  checkToken: `${BASE_URL}/api/accounts/`,
  search: `${BASE_URL}/api/accounts/search`,
  login: `${BASE_URL}/api/users/google`,
  signup: `${BASE_URL}/api/users/signup`,
  callback: `${BASE_URL}/api/users/google/login`,
  userModiorDell: `${BASE_URL}/api/users/profile`,
  getPosts: `${BASE_URL}/api/posts`,
};

export const getToken = () => {
  // const access = localStorage.getItem('accessToken');
  // const refresh = localStorage.getItem('refreshToken');

  const access = `eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNjU5OTczMDg3LCJpYXQiOjE2NTk5NjIyODcsImp0aSI6IjZhZDMzMDhmNjcxNjQ4ZjhiMTA5NjY4NzQyZjI5OTkzIiwic3ViIjo5fQ.C46Mu9RfFRAcr8cwE27fBAI2KMiyQZ5pr5vtOX0Eiq4`;

  const refresh =
    'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTY2MDA0ODY4NywiaWF0IjoxNjU5OTYyMjg3LCJqdGkiOiJhM2JjYWVhZGNiZjY0ZTcxOWRkNjk3MjE4YWNlMjhmMiIsInN1YiI6OX0.jzGcJQaKAlm_xHJkfIEvzt-_XYUr-dE1dQ3SixbyWp0';

  const id = localStorage.getItem('id');

  return { access, refresh, id };
};

export const setAccessToken = (token: string) =>
  localStorage.setItem('accessToken', token);

export const TINYMCE_API_KEY =
  'zxuiph9yiunvdp85dyzooockfmnnka538tzip74drjnbvoia';

export default API;
