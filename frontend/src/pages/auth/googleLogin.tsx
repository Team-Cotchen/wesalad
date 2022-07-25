import React, { useEffect } from 'react';
import qs from 'qs';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import axios from 'axios';

const googleLogin = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // const dispatch = useDispatch();

  console.log('hi');
  const { code } = qs.parse(location.search, {
    ignoreQueryPrefix: true,
  });
  // console.log(code);

  console.log(qs.parse(location.search));

  const getLoginInfo = () => {
    axios
      .get(`https://wesalad.net/users/google/login?code=${code}`)
      .then((res) => console.log(res));
  };

  useEffect(() => {
    getLoginInfo();
  }, [code]);

  return null;
};

export default googleLogin;
