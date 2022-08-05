import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import theme from 'styles/theme';
import Nav from 'components/Nav/Nav';
import { message } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from 'redux/store';
import { useNavigate } from 'react-router-dom';
import { clearStep } from 'redux/reducers/loginSlice';
import { IFetchResultData } from 'components/LoginStep/loginStep.types';
import API from 'config';
import axios from 'axios';
import Modal from 'components/Modal/Modal';
import DeleteBtn from 'components/SettingContainer/DeleteBtn';
import StackModiSection from 'components/SettingContainer/setStackModiSection';
import 'antd/dist/antd.min.css';
import AnswerModiSection from 'components/SettingContainer/setAnswerModiSection';

export interface IUserAnswerModi {
  id: number;
  answers: string;
  imageUrl: string;
}

const token = {
  access: localStorage.getItem('accessToken'),
  refresh: localStorage.getItem('refreshToken'),
};

const Setting = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showPopup, setShowPopup] = useState(false);
  const imageUrl = useSelector((state: RootState) => state.login.imageUrl);
  const [user, setUser] = useState<IFetchResultData>();

  // 첫페이지 렌더링 시 token 유무 검증
  useEffect(() => {
    if (token.access === null) {
      message.warning('로그인이 필요합니다.');
      return navigate('/');
    }
  }, [navigate]);

  const [userName, setUserName] = useState('');
  const [userOrdinalNumber, setUserOrdinalNumber] = useState(0);
  const [userStackModi, setUserStackModi] = useState<string[]>([]);
  const [userAnswerModi, setUserAnswerModi] = useState<IUserAnswerModi[]>();

  const openModal = () => {
    document.body.style.overflow = 'hidden';
    setShowPopup((state) => !state);
  };

  const closeModal = () => {
    document.body.style.overflow = 'auto';
    setShowPopup((state) => !state);
  };

  useEffect(() => {
    const userInfo = async () => {
      const { data } = await axios.get(`${API.userModiorDell}`, {
        headers: {
          access: `${token.access}`,
          refresh: `${token.refresh}`,
        },
      });
      setUser(data);

      if (user === undefined) {
        return;
      }
      setUserName(user.name);
      setUserOrdinalNumber(user.ordinal_number);

      user?.user_stacks?.map((stacks) => {
        setUserStackModi((prev) => [...prev, stacks.stack.title]);
      });

      const userAnswer = user?.user_answers.map((answer, i) => {
        return {
          id: i,
          answers: answer.answer.description,
          imageUrl: answer.answer.image_url,
        };
      });

      setUserAnswerModi(userAnswer);
    };
    userInfo();
  }, [user?.name, user?.ordinal_number]);

  const onCompleteClick = async () => {
    if (!userName) {
      message.warning('이름을 적어주세요.');
      return;
    } else if (userName.length > 10) {
      message.warning('이름의 최대길이는 10글자 입니다.');
      return;
    }

    if (isNaN(userOrdinalNumber) || userOrdinalNumber <= 0) {
      message.warning('기수를 숫자로 입력해주세요.');
      return;
    } else {
      const fetchByUserModi = async () => {
        const stacksToString = String(userStackModi);
        const ordinalToNumber = Number(userOrdinalNumber);

        const setFetchFormData = {
          name: userName,
          ordinal_number: ordinalToNumber,
          stacks: stacksToString,
        };

        try {
          const res = await axios({
            method: 'patch',
            url: `${API.userModiorDell}`,

            headers: {
              'Content-Type': 'application/json',
              access: `${token.access}`,
              refresh: `${token.refresh}`,
            },
            data: setFetchFormData,
          });

          if (res.status === 201) {
            message.success('회원정보 수정이 완료되었습니다. 🌈');
            navigate('/');
          }
        } catch (error) {
          console.log(error);
        }
      };
      fetchByUserModi();
    }
  };

  const onDeleteClick = async () => {
    const deleteUserId = await axios.delete(`${API.userModiorDell}`, {
      headers: {
        access: `${token.access}`,
        refresh: `${token.refresh}`,
      },
    });

    if (deleteUserId) {
      dispatch(clearStep());
      localStorage.clear();
      navigate('/');
    } else {
      message.warning('회원 탈퇴에 실패하였어요! 잠시 후 다시 시도해주세요.');
    }
  };

  return (
    <>
      <Nav />
      <Wrapper>
        <Container>
          <Title>내 정보 수정하기</Title>
          <ProfileContainer>
            <ProfileImg src={imageUrl} />
            <UserInfoContainer>
              <Section>
                <DetailTitle>
                  <span>기수</span>
                  <input
                    type="number"
                    value={userOrdinalNumber || ''}
                    onChange={(e) => {
                      setUserOrdinalNumber(parseInt(e.target.value));
                    }}
                  />
                </DetailTitle>
              </Section>
              <Section>
                <DetailTitle>
                  <span>이름</span>
                  <input
                    type="text"
                    value={userName}
                    onChange={(e) => {
                      setUserName(e.target.value);
                    }}
                  />
                </DetailTitle>
              </Section>
            </UserInfoContainer>
          </ProfileContainer>
          <SelectSection>
            <h1>관심 기술 태그</h1>
            <StackModiSection
              userStackModi={userStackModi}
              setUserStackModi={setUserStackModi}
            />

            <h1>성향 확인하기</h1>
            <AnswerModiSection
              userAnswerModi={userAnswerModi}
              setUserAnswerModi={setUserAnswerModi}
            />
          </SelectSection>

          <ButtonContainer>
            <button onClick={onCompleteClick}>완료</button>
            <button onClick={openModal}>회원탈퇴</button>
          </ButtonContainer>
        </Container>

        <Modal onClose={closeModal} visible={showPopup}>
          <DeleteBtn onClose={closeModal} onDelete={onDeleteClick} />
        </Modal>
      </Wrapper>
    </>
  );
};

export default Setting;

const Wrapper = styled.div`
  ${theme.wrapper()};
  padding: 6rem 13rem;
`;

const Container = styled.div``;

const Title = styled.h1`
  font-size: 2rem;
  margin: 0px 0px 0px 10px;
`;

const DetailTitle = styled.div`
  border-bottom: 2px solid rgba(0, 0, 0, 0.3);

  span {
    display: block;
    height: 40px;
    margin-right: 5px;
    border: none;
    font-size: 20px;
    line-height: 40px;
    transform: translateY(1px);
    margin-bottom: 5px;
  }
`;

const ProfileContainer = styled.div`
  ${({ theme }) => theme.flexMixIn('start', 'center')}
  padding: 2rem;
  border-radius: 10%;
  box-shadow: rgb(0 0 0 / 4%) 10px 10px 20px;
`;

const UserInfoContainer = styled.form`
  display: flex;
  justify-content: center;
  flex-direction: column;
  width: 100%;
  height: 200px;
  margin-left: 20px;
  padding: 20px;
  border-left: 2px solid ${({ theme }) => theme.mainGreen};

  input[type='number']::-webkit-outer-spin-button,
  input[type='number']::-webkit-inner-spin-button {
    -webkit-appearance: none;
  }

  input {
    height: 40px;
    padding: 0px 10px;
    border: none;
    font-size: 20px;
    line-height: 40px;
    font-family: 'Jua', sans-serif;
  }
`;

const ButtonContainer = styled.div`
  margin-top: 30px;

  button {
    width: 100px;
    border: 1px solid ${({ theme }) => theme.mainGreen};
    background-color: white;
    padding: 5px 0px;
    margin-right: 10px;
    border-radius: 4px;
    font-size: 20px;
    cursor: pointer;

    &:hover {
      background-color: ${({ theme }) => theme.mainGreen};
      color: black;
    }
  }
`;

const ProfileImg = styled.img`
  width: 10rem;
  height: 10rem;
  border-radius: 50%;
  margin-right: 1rem;
`;

const Section = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const SelectSection = styled.div`
  h1 {
    font-size: 1.5rem;
    margin: 20px 0px 5px 10px;
  }
`;
