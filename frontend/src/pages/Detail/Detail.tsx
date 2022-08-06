import axios from 'axios';
import { message, Popconfirm, Tag } from 'antd';
import dayjs from 'dayjs';
import { FiExternalLink } from 'react-icons/fi';
import { useDispatch } from 'react-redux';
import React, {
  useEffect,
  useState,
  FunctionComponent,
  useCallback,
} from 'react';
import { clearStep } from 'redux/reducers/loginSlice';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import { BASE_URL } from 'config';
import customHttp from 'utils/Axios';
import Nav from 'components/Nav/Nav';
import Card from 'components/Card';
import PostBackButton from 'components/PostBackButton';
import type { DetailModel } from 'pages/Detail/Detail.model';

import theme from 'styles/theme';
import { devices } from 'styles/devices';

const Detail: FunctionComponent = () => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const navigate = useNavigate();
  const [detailInfo, setDetailInfo] = useState<DetailModel>();

  const getDetails = useCallback(async () => {
    try {
      const { data } = await axios.get(`${BASE_URL}/api/posts/${id}`);
      setDetailInfo(data);
    } catch (err) {
      console.log(err);
    }
  }, [id]);

  useEffect(() => {
    getDetails();
  }, [getDetails]);

  const deletePost = async () => {
    try {
      const res = await customHttp.delete(`${BASE_URL}/api/posts/${id}`);

      if (res.status === 204) {
        message.success('해당 게시글이 삭제되었습니다.');
        navigate('/');
      }
    } catch (err) {
      console.log(err);

      if (
        (err as { response: { data: { ERROR: string } } }).response?.data
          ?.ERROR === 'YOUR_LOGIN_HAS_EXPIRED'
      ) {
        logout();
      } else if (
        (err as { response: { data: string } }).response.data ===
        'POST_DOES_NOT_EXIST'
      )
        message.error('해당 게시글은 이미 삭제되었습니다.');
      else message.error('해당 게시글이 삭제되지 않았습니다.');
    }
  };

  const goToEdit = () => {
    navigate(`/edit/${id}`);
    console.log('hi');
  };

  const logout = () => {
    message.warn('로그아웃이 되었습니다. 다시 로그인해주세요.');
    navigate('/');
    dispatch(clearStep());
    localStorage.clear();
  };

  return (
    <>
      <Nav />
      <Wrapper>
        <Header>
          <PostBackButton />
          <HeaderTitle>
            {detailInfo?.title}
            <TitleLine />
          </HeaderTitle>
          <HeaderInfo>
            <UserInfo>
              <Profile
                src={
                  detailInfo?.user?.image_url ||
                  'https://i.ibb.co/0CNSQWx/profile.png'
                }
              />
              <span>
                {detailInfo?.user?.ordinal_number}기 {detailInfo?.user?.name}
              </span>
            </UserInfo>
            <Date>
              {dayjs(detailInfo?.created_at).format(
                'YYYY년 mm월 DD일 HH:mm:ss',
              )}
            </Date>
            {detailInfo?.status === 'active' ? (
              <StatusTag color="blue">현재 모집 중</StatusTag>
            ) : (
              <StatusTag color="gray">모집 마감</StatusTag>
            )}
          </HeaderInfo>
        </Header>
        <Line />
        <BasicInfo>
          <Title>
            <Num>1</Num>프로젝트 레시피
            <Spicy>
              맵기 단계
              <Flavor>
                <FlavorImg
                  alt="pepper"
                  src={detailInfo?.post_flavor?.image_url}
                />
                {detailInfo?.post_flavor?.title}
                <FlavorDetail>{`(${detailInfo?.post_flavor?.description})`}</FlavorDetail>
              </Flavor>
            </Spicy>
          </Title>
          <InfoList>
            <ListSection>
              <ListItem>
                <ItemTitle>프로젝트 타입</ItemTitle>
                <Content>{detailInfo?.category}</Content>
              </ListItem>
              <ListItem>
                <ItemTitle>진행 방식 </ItemTitle>
                <Content>{detailInfo?.post_place.title}</Content>
              </ListItem>
              <ListItem>
                <ItemTitle>프론트엔드 모집 인원</ItemTitle>
                <Content>{detailInfo?.number_of_front}</Content>
              </ListItem>
              <ListItem>
                <ItemTitle>백엔드 모집 인원</ItemTitle>
                <Content>{detailInfo?.number_of_back}</Content>
              </ListItem>
            </ListSection>
            <ListSection>
              <ListItem>
                <ItemTitle>기술 스택</ItemTitle>
                <Content>
                  {detailInfo?.post_stack?.map(({ image_url }, idx) => (
                    <Stackimage key={idx} src={image_url} />
                  ))}
                </Content>
              </ListItem>
              <ListItem>
                <ItemTitle>진행 기간</ItemTitle>
                <Content>{detailInfo?.period}</Content>
              </ListItem>
              <ListItem>
                <ItemTitle>시작 예정일</ItemTitle>
                <Content>
                  {dayjs(detailInfo?.start_date).format('YYYY-MM-DD')}
                </Content>
              </ListItem>
              <ListItem>
                <ItemTitle>연락 방법</ItemTitle>
                <Content>{detailInfo?.post_applyway.title}</Content>
              </ListItem>
              <ListItem>
                <ItemTitle>연락할 곳</ItemTitle>
                <Content>
                  {detailInfo?.post_applyway.title !== '이메일' ? (
                    <ExternalLink
                      target="_blank"
                      rel="noreferrer"
                      href={detailInfo?.post_applyway.description}
                    >
                      {detailInfo?.post_applyway.description}
                      <FiExternalLink />
                    </ExternalLink>
                  ) : (
                    detailInfo?.post_applyway.description
                  )}
                </Content>
              </ListItem>
            </ListSection>
          </InfoList>
        </BasicInfo>
        <PersonalityList>
          <SemiTitle>
            <Salad src="https://i.ibb.co/PrKjyH6/salad.png" />
            우리는 이런 재료를 가진 팀원들과 함께 하고 싶어요.
          </SemiTitle>
          <CardBox>
            {detailInfo?.post_answer?.[0]?.primary_answer?.map(
              ({ description, image_url }) => (
                <Card
                  id={description}
                  key={description}
                  image_url={image_url}
                  name={description}
                />
              ),
            )}

            {detailInfo?.post_answer?.[0]?.secondary_answer?.map(
              ({ description, image_url }) => (
                <Card
                  id={description}
                  key={description}
                  image_url={image_url}
                  name={description}
                />
              ),
            )}
          </CardBox>
        </PersonalityList>
        <Introduction>
          <Title>
            <Num>2</Num>프로젝트 소개
          </Title>
          <Line></Line>
          <MainContent>
            {detailInfo?.description ? (
              <div
                dangerouslySetInnerHTML={{
                  __html: detailInfo?.description,
                }}
              ></div>
            ) : (
              ''
            )}
          </MainContent>
          <Line />
        </Introduction>
        {localStorage.getItem('id') !== undefined &&
          localStorage.getItem('id') === detailInfo?.user.id && (
            <>
              <EditButton onClick={goToEdit}>수정</EditButton>
              <Popconfirm title="삭제하시겠습니까?" onConfirm={deletePost}>
                <DeleteButton>삭제</DeleteButton>
              </Popconfirm>
            </>
          )}
      </Wrapper>
    </>
  );
};

export default Detail;

const Wrapper = styled.div`
  ${theme.wrapper()};
  position: relative;

  @media screen and ${devices.laptop} {
    overflow-x: hidden;
    width: 900px;
  }

  @media screen and ${devices.tablet} {
    overflow-x: hidden;
    width: 720px;
  }

  @media screen and ${devices.mobile} {
    overflow-x: hidden;
    width: 500px;
  }
`;

// header
const Header = styled.header`
  margin-top: 120px;
`;

const HeaderTitle = styled.h1`
  position: relative;
  display: inline-block;
  margin: 20px 0;
  padding-left: 30px;
  font-size: 40px;
  font-weight: ${theme.weightSemiBold};

  @media screen and ${devices.mobile} {
    margin: 10px 0;
  }
`;

const TitleLine = styled.div`
  position: absolute;
  bottom: 10px;
  width: 100%;
  height: 15px;
  background-color: ${theme.mainGreen};
  z-index: -1;

  @media screen and ${devices.mobile} {
    width: 80%;
    height: 12px;
  }
`;

const HeaderInfo = styled.div`
  display: flex;
  align-items: center;
`;

const StatusTag = styled(Tag)`
  margin: 0 15px;
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  margin: 20px;
  padding-right: 20px;
  font-weight: ${theme.weightBold};
  border-right: 1px solid #dbdbdb;

  @media screen and ${devices.laptop} {
    margin: 10px 20px;
  }
`;

const Profile = styled.img`
  margin-right: 10px;
  width: 40px;
  height: 40px;
  border-radius: 50%;

  @media screen and ${devices.mobile} {
    width: 30px;
    height: 30px;
  }
`;

const Date = styled.div`
  color: #999999;
`;

const Line = styled.div`
  width: 100%;
  height: 1px;
  margin: 20px 0;
  background-color: #dfe1e6;

  @media screen and ${devices.mobile} {
    margin: 10px 0;
  }
`;

//BasicInfo
const BasicInfo = styled.div`
  padding: 20px;

  @media screen and ${devices.laptop} {
    padding: 15px;
  }
`;

const Title = styled.h2`
  position: relative;
  font-size: 25px;

  @media screen and ${devices.laptop} {
    font-size: 22px;
  }

  @media screen and ${devices.mobile} {
    margin-bottom: 60px;
    font-size: 18px;
  }
`;

const Spicy = styled.div`
  position: absolute;
  top: -20px;
  right: 0;
  font-size: ${theme.fontRegular};
  text-align: center;
  background-color: #f4f5f7;
  padding: 20px;
  border-radius: 3px;
  box-shadow: 7px 5px 7px -6px #4e4e4e;

  p {
    margin-top: 10px;
    font-size: ${theme.fontSmall};
  }

  @media screen and ${devices.laptop} {
    padding: 10px;
    font-size: 15px;
  }

  @media screen and ${devices.mobile} {
    margin-top: 10px;
  }
`;

const Flavor = styled.div`
  display: flex;
`;

const FlavorImg = styled.img`
  width: 30px;
  height: 30px;

  @media screen and ${devices.laptop} {
    width: 25px;
    height: 25px;
  }
`;

const FlavorDetail = styled.div`
  margin: 0 10px;
  font-size: ${theme.fontSmall};
  color: #999999;

  @media screen and ${devices.laptop} {
    font-size: 13px;
  }
`;

const Num = styled.span`
  display: inline-block;
  margin-right: 10px;
  text-align: center;
  line-height: 35px;
  width: 35px;
  height: 35px;
  border-radius: 50%;
  color: #fff;
  background-color: ${theme.mainGreen};

  @media screen and ${devices.laptop} {
    width: 30px;
    height: 30px;
    line-height: 30px;
  }

  @media screen and ${devices.mobile} {
    width: 25px;
    height: 25px;
    line-height: 25px;
  }
`;

const InfoList = styled.ul`
  display: flex;

  @media screen and ${devices.mobile} {
    display: block;
  }
`;

const ListSection = styled.div`
  flex: 1;
  margin: 30px 0;

  @media screen and ${devices.laptop} {
    margin: 10px 0;
  }

  @media screen and ${devices.mobile} {
    margin: 0;
  }
`;

const ListItem = styled.li`
  display: flex;
  font-family: ‘Black Han Sans’, sans-serif;
  margin: 30px;
  font-size: ${theme.fontRegular};
  font-weight: ${theme.weightSemiBold};

  @media screen and ${devices.laptop} {
    margin: 15px 0;
    font-size: ${theme.fontSmall};
  }

  @media screen and ${devices.mobile} {
    margin: 20px;
    font-size: ${theme.fontSmall};
  }
`;

const ItemTitle = styled.div`
  width: 200px;
  color: #808080;

  @media screen and ${devices.laptop} {
    width: 150px;
    border-right: 1px solid #dbdbdb;
    margin-right: 10px;
  }

  @media screen and ${devices.mobile} {
    width: 200px;
    border: 0;
  }
`;

const Stackimage = styled.img`
  transform: translate(0px, -14px);
  margin-bottom: -20px;
  width: 40px;
  height: 40px;

  @media screen and ${devices.laptop} {
    transform: translate(0px, -10px);
    width: 35px;
    height: 35px;
  }

  @media screen and ${devices.mobile} {
    transform: translate(0px, -17px);
    width: 30px;
    height: 30px;
  }
`;

const Content = styled.div``;

const ExternalLink = styled.a`
  text-decoration: 'none';
  color: black;
`;

//Personality List
const PersonalityList = styled.div`
  padding: 20px;
`;

const CardBox = styled.div`
margin-top: 30px;
padding-bottom 20px;
border-radius: 3px;

@media screen and ${devices.laptop} {
  margin-top: 0px;
}
`;

const SemiTitle = styled.h3`
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  font-size: 20px;

  @media screen and ${devices.laptop} {
    margin-bottom: 10px;
  }

  @media screen and ${devices.mobile} {
    font-size: 17px;
  }
`;

const Salad = styled.img`
  width: 30px;
  height: 30px;
  margin-right: 20px;

  @media screen and ${devices.mobile} {
    width: 25px;
    height: 25px;
    margin: 0 10px;
  }
`;

//Introduction
const Introduction = styled.div`
  padding: 20px;
  margin-bottom: 40px;
`;

const MainContent = styled.div`
  font-family: ‘Black Han Sans’, sans-serif;
  padding: 20px;
  line-height: 30px;
`;

const EditButton = styled.button`
  position: absolute;
  right: 100px;
  bottom: -40px;
  margin-bottom: 20px;
  padding: 10px 20px;
  background: ${theme.mainGreen};
  font-size: ${theme.fontRegular};
  color: #fff;
  border: 0;
  border-radius: 10px;
  cursor: pointer;

  @media screen and ${devices.laptop} {
    bottom: -10px;
  }

  @media screen and ${devices.tablet} {
    bottom: -20px;
  }

  @media screen and ${devices.mobile} {
    right: 90px;
    bottom: 0;
    padding: 7px 15px;
  }
`;

const DeleteButton = styled.button`
  position: absolute;
  right: 20px;
  bottom: -40px;
  padding: 10px 20px;
  margin-bottom: 20px;
  background: #999;
  font-size: ${theme.fontRegular};
  color: #fff;
  border: 0;
  border-radius: 10px;
  cursor: pointer;

  @media screen and ${devices.laptop} {
    bottom: -10px;
  }

  @media screen and ${devices.tablet} {
    bottom: -20px;
  }

  @media screen and ${devices.mobile} {
    bottom: 0;
    padding: 7px 15px;
  }
`;
