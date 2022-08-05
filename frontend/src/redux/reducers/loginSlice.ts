import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  currentStep: 2,
  signupId: undefined,
  loginId: undefined,
  imageUrl: undefined,
  modalVisible: false,
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
});

export const {
  nextStep,
  setModalVisible,
  previousStep,
  setSignUpInfo,
  clearStep,
} = loginSlice.actions;
export default loginSlice;
