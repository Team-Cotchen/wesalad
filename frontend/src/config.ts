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

  const access =
    'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNjYwMTUxNjg1LCJpYXQiOjE2NjAxNDA4ODUsImp0aSI6IjFhYzNlOGMzMGE5MjRkM2NhN2E0MTdhNWU4NWZiYjg4Iiwic3ViIjo5fQ.7nKGi2poJdM03VT7n-ei9l3KkdcWCrMh0Gs5mE2plRc';

  const refresh = `eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTY2MDIyNzI4NSwiaWF0IjoxNjYwMTQwODg1LCJqdGkiOiI0YWQ1MDRhYWViMDE0MDFjODgzZWY3NGQ1YTI3NjBhMCIsInN1YiI6OX0.i91G69zHbvWsFgukA63qeVH7H7Vb0gqr8yFrLVHxXuE`;

  const id = localStorage.getItem('id');

  return { access, refresh, id };
};

export const setAccessToken = (token: string) =>
  localStorage.setItem('accessToken', token);

export const TINYMCE_API_KEY =
  'zxuiph9yiunvdp85dyzooockfmnnka538tzip74drjnbvoia';

export default API;
