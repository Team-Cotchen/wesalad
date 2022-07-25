import React, { useEffect, useState } from 'react';
import { IBasicInfo } from 'components/LoginStep/loginStep.types';
import styled from 'styled-components';
import axios from 'axios';
import API from 'config';

const access =
  'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNjU4MjI5NzM0LCJpYXQiOjE2NTgyMTg5MzQsImp0aSI6IjA2NmNjMDkzZmY3MjQ5ODE4Y2E1YzFhMTI4Y2Q3OWQ1Iiwic3ViIjo2fQ.cvDSVUEDOgWnFH34pzbpaabpzhMDXaY5ak-5nBaohOs';

const refresh =
  'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTY1ODMwNTMzNCwiaWF0IjoxNjU4MjE4OTM0LCJqdGkiOiIzMWUwYjE5OGM4ZDI0ZDAxOGRhZjkwMWM4NzI5OGVkYSIsInN1YiI6Nn0.iMiNIsUXXV8Wi9aX1w229QBHmT9bAWZkdY9RvqMIuZc';

const Test = () => {
  const [token, setToken] = useState<any>();
  const id = 1;
  const [basicInfo, setBasicInfo] = useState<IBasicInfo>({
    name: '',
    ordinal_number: 0,
    answers: '',
    stacks: '',
  });

  useEffect(() => {
    setBasicInfo({
      ...basicInfo,
      name: '이근휘',
      ordinal_number: 31,
      answers: '적극적인 토마토',
      stacks: 'Javascript,Django',
    });
  }, []);

  const fetchByUserInfo = async () => {
    try {
      const res = await axios({
        method: 'post',
        url: `https://wesalad.net/users/signup/9`,
        headers: {
          'Content-Type': 'application/json',
        },
        data: basicInfo,
      });

      if (res.status === 200) alert('되네요');
    } catch (error) {
      console.log(error);
    }
  };

  // 최종본
  const fetchByUserInfoTest = () => {
    axios
      .post('https://wesalad.net/users/signup/8', basicInfo)
      .then((res) => {
        console.log(res);
      })

      .catch((err) => {
        console.log(err);
      });
  };

  const testGetAPI = () => {
    axios
      .get(
        'https://wesalad.net/users/google/login?code=4%2F0AdQt8qhnZAvF7QTNAoSySZuecxhJJkOIWrDH6p6dG_bd_u-gZH97JfvTUaAd4MsqJ2KhwQ&scope=email+profile+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.email+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.profile+openid&authuser=0&prompt=none',
      )
      .then((res) => {
        console.log(res);
      });
  };

  const fetchByUserDelete = () => {
    axios
      .delete('https://wesalad.net/users/profile/8')
      .then((res) => console.log(res))
      .catch((err) => console.log(err));
  };

  return (
    <div>
      <TestBtn onClick={fetchByUserInfo}>추가</TestBtn>
      <TestBtn onClick={fetchByUserDelete}>삭제</TestBtn>
      {/* <TestBtn onClick={fetchByUserInfoPut}>수정</TestBtn> */}
      <TestBtn onClick={testGetAPI}>테스트</TestBtn>
    </div>
  );
};

const TestBtn = styled.div`
  cursor: pointer;
  &:hover {
    color: red;
  }
`;

export default Test;
