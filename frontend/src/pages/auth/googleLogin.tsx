import { useEffect } from 'react';
import qs from 'qs';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useRootState } from 'redux/hooks/useRootState';
import axios from 'axios';
import API from 'config';

import {
  nextStep,
  setSignUpInfo,
  setModalVisible,
} from 'redux/reducers/loginSlice';

const googleLogin = () => {
  const loginStep = useRootState((state) => state.login.currentStep);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const { code } = qs.parse(location.search, {
    ignoreQueryPrefix: true,
  });

  const getLoginInfo = async () => {
    const { data } = await axios.get(`${API.callback}?code=${code}`);

    const token = data?.token;
    const googleAccountId = data?.google_account_id;
    const imageUrl = data?.image_url;

    dispatch(
      setSignUpInfo({
        key: 'imageUrl',
        value: imageUrl,
      }),
    );

    if (token !== undefined) {
      localStorage.setItem('accessToken', token.access);
      localStorage.setItem('refreshToken', token.refresh);
      localStorage.setItem('id', token.user_id);
    } else {
      dispatch(
        setSignUpInfo({
          key: 'id',
          value: googleAccountId,
        }),
      );
      dispatch(setModalVisible(true));
      dispatch(nextStep(loginStep));
    }
    navigate('/');
  };

  useEffect(() => {
    getLoginInfo();
  }, [code]);

  return null;
};

export default googleLogin;
