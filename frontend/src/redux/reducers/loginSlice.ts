import { createSlice } from '@reduxjs/toolkit';
import loginAsync from '../actions/loginAsync';

const initialState = {
  currentStep: 1,
  id: undefined,
  imageUrl: undefined,
  modalVisible: false,
  data: [],
};

const loginSlice = createSlice({
  name: 'LoginStep',
  initialState,
  reducers: {
    // 동기처리
    nextStep: (state, action) => ({
      ...state,
      currentStep: state.currentStep + 1,
    }),
    previousStep: (state, action) => ({
      ...state,
      currentStep: state.currentStep - 1,
    }),
    setModalVisible: (state, action) => ({
      ...state,
      modalVisible: action.payload,
    }),
    setSignUpInfo: (state, { payload: { key, value } }) => ({
      ...state,
      [key]: value,
    }),
    clearStep: () => initialState,
  },
  // 비동기처리
  extraReducers: (builder) =>
    builder.addCase(loginAsync.fulfilled, (state, { payload }) => ({
      ...state,
    })),
});

export const {
  nextStep,
  setModalVisible,
  previousStep,
  setSignUpInfo,
  clearStep,
} = loginSlice.actions;
export default loginSlice;
