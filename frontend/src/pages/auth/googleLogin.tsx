import { useEffect } from 'react';
import qs from 'qs';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import API from 'config';
import { RootState } from 'redux/store';
import {
  nextStep,
  setSignUpInfo,
  setModalVisible,
} from 'redux/reducers/loginSlice';

const googleLogin = () => {
  const loginStep = useSelector((state: RootState) => state.login.currentStep);
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

    if (token !== undefined) {
      localStorage.setItem('accessToken', token.access);
      localStorage.setItem('refreshToken', token.refresh);
    } else {
      dispatch(
        setSignUpInfo({
          key: 'imageUrl',
          value: imageUrl,
        }),
      );

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
