import axios from 'axios';
import { Tag, Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { FiExternalLink } from 'react-icons/fi';
import React, {
  useEffect,
  useState,
  FunctionComponent,
  useCallback,
} from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';

import { BASE_URL } from 'config';
import Nav from 'components/Nav/Nav';
import Card from 'components/Card';
import PostBackButton from 'components/PostBackButton';
import type { DetailModel } from 'pages/Detail/Detail.model';

import theme from 'styles/theme';
import { devices } from 'styles/devices';

const Detail: FunctionComponent = () => {
  const { id } = useParams();
  const [detailInfo, setDetailInfo] = useState<DetailModel>();
  const [isLoading, setIsLoading] = useState(false);

  const getDetails = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data } = await axios.get(`${BASE_URL}/api/posts/${id}`);
      setDetailInfo(data);
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    getDetails();
    window.scrollTo(0, 0);
  }, [getDetails]);

  return (
    <>
      <Nav />
      {isLoading ? (
        <div style={{ position: 'absolute', top: '45%', right: '45%' }}>
          <Spin indicator={<LoadingOutlined style={{ fontSize: '40px' }} />} />
        </div>
      ) : (
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
                  'YYYY년 MM월 DD일 HH:mm:ss',
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
              <Num>1</Num>
              {detailInfo?.category} 레시피
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
                  <ItemTitle>모집 구분</ItemTitle>
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
                  <ItemTitle>시작 예정일</ItemTitle>
                  <Content>
                    {dayjs(detailInfo?.start_date).format('YYYY-MM-DD')}
                  </Content>
                </ListItem>

                <ListItem>
                  <ItemTitle>진행 기간</ItemTitle>
                  <Content>{detailInfo?.period}</Content>
                </ListItem>

                <ListItem>
                  <ItemTitle>연락 방법</ItemTitle>
                  <Content>{detailInfo?.post_applyway.title}</Content>
                </ListItem>
                <ListItem>
                  <ItemTitle>연락할 곳</ItemTitle>
                  <Content>
                    {detailInfo?.post_applyway.title === '카카오톡 오픈채팅' ? (
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
                <ListItem>
                  <ItemTitle>기술 스택</ItemTitle>
                  <Content>
                    {detailInfo?.post_stack?.map(({ image_url }, idx) => (
                      <Stackimage key={idx} src={image_url} />
                    ))}
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
              <CardBoxLabel>메인 재료</CardBoxLabel>
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
            </CardBox>
            <CardBox>
              {detailInfo &&
                detailInfo.post_answer[1].secondary_answer?.length > 0 && (
                  <CardBoxLabel>추가 재료</CardBoxLabel>
                )}

              {detailInfo?.post_answer?.[1]?.secondary_answer?.map(
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
              <Num>2</Num> {detailInfo?.category} 소개
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
        </Wrapper>
      )}
    </>
  );
};

export default Detail;

const Wrapper = styled.div`
  ${theme.wrapper()};
  position: relative;

  @media screen and ${devices.laptop} {
    width: 800px;
    padding: 0 40px;
  }

  @media screen and ${devices.tablet} {
    width: 600px;
    padding: 0;
  }

  @media screen and ${devices.mobile} {
    width: 500px;
    padding: 0;
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
    font-size: 30px;
  }
`;

const TitleLine = styled.div`
  position: absolute;
  bottom: 10px;
  width: 90%;
  height: 15px;
  background-color: ${theme.mainGreen};
  z-index: -1;

  @media screen and ${devices.mobile} {
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

  @media screen and ${devices.mobile} {
    font-size: 15px;
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

  @media screen and ${devices.mobile} {
    font-size: 15px;
  }
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
    width: 135px;
    margin-right: 10px;
  }

  @media screen and ${devices.mobile} {
    width: 200px;
    border: 0;
  }
`;

const Stackimage = styled.img`
  transform: translate(0px, -14px);
  margin: 5px 10px 0 0;
  padding: 2px;
  width: 45px;
  height: 45px;
  border: 1px solid #dbdbdb;
  border-radius: 50%;

  @media screen and ${devices.laptop} {
    transform: translate(0px, -10px);
    width: 33px;
    height: 33px;
  }

  @media screen and ${devices.mobile} {
    transform: translate(0px, -17px);
    width: 32px;
    height: 32px;
    margin-top: 11px;
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
  position: relative;
  margin-top: 30px;
  border: transparant 1px solid;
  border-radius: 10px;
  background: #f4f5f7;
`;

const CardBoxLabel = styled.span`
  position: absolute;
  left: 20px;
  top: -10px;
  font-size: ${theme.fontMicro};
  color: ${theme.mainViolet};
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
