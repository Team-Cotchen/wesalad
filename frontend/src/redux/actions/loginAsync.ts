import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import API from 'config';

const loginAsync = createAsyncThunk('user/login', async (data, thunkAPI) => {
  const response = await axios.get('/users/google/login');
  const result = response.data;
  return result;
});

export default loginAsync;
