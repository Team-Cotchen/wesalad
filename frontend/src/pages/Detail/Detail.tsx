import axios from 'axios';
import React, { useEffect, useState, FunctionComponent } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import theme from 'styles/theme';

import profile from 'assets/images/profile.png';
import salad from 'assets/images/salad.png';

import Card from '../../components/Card';
import { FaPepperHot } from 'react-icons/fa';
import { BASE_URL } from 'config';
import { FiExternalLink } from 'react-icons/fi';

import type { DetailModel } from './DetailModel';

const Detail: FunctionComponent = () => {
  const [detailInfo, setDetailInfo] = useState<DetailModel>();

  const { id } = useParams();

  const getDetails = async () => {
    try {
      // const { data } = await axios.get(`${BASE_URL}/posts/${id}`);

      //mock data
      const { data } = await axios.get('/cardsdata.json');

      setDetailInfo(data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getDetails();
  }, []);

  // review post 필요@

  // customize date data
  const year = detailInfo?.created_at.split('-')[0];
  const month = detailInfo?.created_at.split('-')[1];
  const day = detailInfo?.created_at.split('-')[2].split('T')[0];
  const time = detailInfo?.created_at.split('-')[2].split('T')[1].split('.')[0];

  return (
    <Wrapper>
      <Header>
        <HeaderTitle>
          {detailInfo?.title}
          <TitleLine />
        </HeaderTitle>

        <HeaderInfo>
          <UserInfo>
            <Profile src={detailInfo?.user?.image_url || profile} />
            <span>
              {detailInfo?.user?.ordinal_number}기 {detailInfo?.user?.name}
            </span>
          </UserInfo>
          <Date>
            {year}년 {month}월 {day}일 {time}
          </Date>
        </HeaderInfo>
      </Header>
      <Line />
      <BasicInfo>
        <Title>
          <Num>1</Num>프로젝트 레시피
          <Spicy>
            맵기 단계
            <Pepper /> <p> </p>
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
              <Content>{detailInfo?.post_place}</Content>
            </ListItem>
            <ListItem>
              <ItemTitle>프론트엔드 모집 인원</ItemTitle>
              <Content>{detailInfo?.number_of_front}명</Content>
            </ListItem>
            <ListItem>
              <ItemTitle>백엔드 모집 인원</ItemTitle>
              <Content>{detailInfo?.number_of_back}명</Content>
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
              <Content>{detailInfo?.start_date.split('T')[0]}</Content>
            </ListItem>
            <ListItem>
              <ItemTitle>연락 방법</ItemTitle>
              <Content>{detailInfo?.post_applyway[0].title}</Content>
            </ListItem>
            <ListItem>
              <ItemTitle>연락할 곳</ItemTitle>
              <Content>
                {detailInfo?.post_applyway[0].title !== '이메일' ? (
                  <ExternalLink
                    target="_blank"
                    rel="noreferrer"
                    href={detailInfo?.post_applyway[0].description}
                  >
                    {detailInfo?.post_applyway[0].description}
                    <FiExternalLink />
                  </ExternalLink>
                ) : (
                  detailInfo?.post_applyway[0].description
                )}
              </Content>
            </ListItem>
          </ListSection>
        </InfoList>
      </BasicInfo>
      <PersonalityList>
        <SemiTitle>
          <Salad src={salad} />
          우리는 이런 재료를 가진 팀원들과 함께 하고 싶어요.
        </SemiTitle>
        <CardBox>
          {detailInfo?.post_answer
            .map((item) => item.answer)
            .map(({ description, image_url }) => (
              <Card
                id={description}
                key={description}
                image_url={image_url}
                name={description}
              />
            ))}
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
                __html: detailInfo.description,
              }}
            ></div>
          ) : (
            ''
          )}
        </MainContent>
        <Line />
        <Comments>
          <SemiTitle>댓글</SemiTitle>
          <CommentInput />
          <CommentBtn>댓글 등록</CommentBtn>
        </Comments>
      </Introduction>
    </Wrapper>
  );
};

export default Detail;

const Wrapper = styled.div`
  ${theme.wrapper()};
`;

// header
const Header = styled.header`
  margin-top: 140px;
`;

const HeaderTitle = styled.h1`
  position: relative;
  display: inline-block;
  margin: 20px 0;
  padding-left: 30px;
  font-size: 40px;
  font-weight: ${theme.weightSemiBold};
`;

const TitleLine = styled.div`
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 15px;
  background-color: ${theme.mainGreen};
  z-index: -1;
`;

const HeaderInfo = styled.div`
  display: flex;
  align-items: center;
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  margin: 20px;
  padding-right: 20px;
  font-weight: ${theme.weightBold};
  border-right: 1px solid #dbdbdb;
`;

const Profile = styled.img`
  margin-right: 10px;
  width: 40px;
  height: 40px;
  border-radius: 50%;
`;

const Date = styled.div`
  color: #999999;
`;

const Line = styled.div`
  width: 100%;
  height: 1px;
  margin: 20px 0;
  background-color: #dfe1e6;
`;

//BasicInfo
const BasicInfo = styled.div`
  padding: 20px;
`;

const Title = styled.h2`
  position: relative;
  font-size: 25px;
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
`;

const Pepper = styled(FaPepperHot)`
  color: #f5390f;
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
`;

const InfoList = styled.ul`
  display: flex;
`;

const ListSection = styled.div`
  flex: 1;
  margin: 30px 0;
`;

const ListItem = styled.li`
  display: flex;
  font-family: ‘Black Han Sans’, sans-serif;
  margin: 30px;
  font-size: ${theme.fontRegular};
  font-weight: ${theme.weightSemiBold};
`;

const ItemTitle = styled.div`
  width: 200px;
  color: #808080;
`;

const Stackimage = styled.img`
  transform: translate(0px, -14px);
  margin-bottom: -20px;
  width: 40px;
  height: 40px;
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
  padding-bottom: 20px;
  border-radius: 3px;
`;

const SemiTitle = styled.h3`
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  font-size: 20px;
`;

const Salad = styled.img`
  width: 30px;
  height: 30px;
  margin-right: 20px;
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

const Comments = styled.div`
  position: relative;
  width: 100%;
`;

const CommentInput = styled.input`
  font-family: ‘Black Han Sans’;
  width: 100%;
  height: 80px;
  padding: 10px;
  border: 1px #dbdbdb solid;
  border-radius: 4px;
  font-size: ${theme.fontRegular};
`;

const CommentBtn = styled.button`
  position: absolute;
  right: 0px;
  bottom: -60px;
  padding: 10px;
  background: ${theme.mainGreen};
  font-size: ${theme.fontRegular};
  color: #fff;
  border: 0;
  border-radius: 30px;
  cursor: pointer;
`;
