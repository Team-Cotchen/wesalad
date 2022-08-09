import {
  Select,
  DatePicker,
  Checkbox,
  message,
  Form,
  Button,
  Switch,
} from 'antd';
import React, { useState, FunctionComponent, useMemo, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ImPointRight } from 'react-icons/im';
import { VscCircleOutline } from 'react-icons/vsc';
import { Editor } from '@tinymce/tinymce-react';
import styled from 'styled-components';

import { BASE_URL, TINYMCE_API_KEY, getToken } from 'config';

import { OPTIONS } from 'assets/data/Options.constant';
import customHttp, { AuthVerify } from 'utils/Axios';

import PostFormModal from 'components/PostForm/PostFormModal';
import Card from 'components/Card';
import Nav from 'components/Nav/Nav';
import type {
  FormatModel,
  FormModel,
  PostModel,
} from 'components/PostForm/PostForm.model';

import theme from 'styles/theme';
import { devices } from 'styles/devices';

import {
  convertToImgCard,
  unSelectedItems,
  convertToFormatted,
} from 'components/PostForm/Post.functions';

const { Option } = Select;
const { Item } = Form;

interface Props {
  mode: 'edit' | 'creation';
  defaultPost: PostModel;
}

const PostForm: FunctionComponent<Props> = ({ mode, defaultPost }: Props) => {
  const { id } = useParams();
  const [form] = Form.useForm();
  const { access } = getToken();
  const navigate = useNavigate();

  const [additionalCards, setAdditionalCards] = useState<string[]>(
    mode === 'edit' ? defaultPost.additional : [],
  );
  const [primaryCards, setPrimaryCards] = useState<string[]>(
    mode === 'edit' ? defaultPost.primary : [],
  );
  const [applyWay, setApplyWay] = useState<unknown>();
  const [flavor, setFlavor] = useState(defaultPost?.fields?.flavor);
  const [description, setDescription] = useState(defaultPost?.description);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const {
    CATEGORY,
    PLACE,
    NUM_OF_DEVELOPER,
    PERIOD,
    APPLY_WAY,
    FLAVOR,
    STACKS,
  } = OPTIONS;
  const PRYMARY_CARDS = convertToImgCard(primaryCards);
  const ADDITIONAL_CARDS = convertToImgCard(additionalCards);
  const ALL_CARDS = useMemo(
    () =>
      [...primaryCards, ...additionalCards].map((item) => {
        return { description: item, is_primary: primaryCards?.includes(item) };
      }),
    [primaryCards, additionalCards],
  );

  useEffect(() => {
    if (access === '' || access === null) {
      message.warning('로그인이 필요합니다.');
      return navigate('/');
    }

    if (AuthVerify() === 'Refresh Token Expired') {
      message.warning('로그인이 만료되었습니다. 다시 로그인 해주세요.');
      return navigate('/');
    }

    if (
      mode === 'edit' &&
      Number(localStorage.getItem('id')) !== Number(defaultPost?.fields?.id)
    ) {
      navigate('/');
      return message.warning('해당 게시글에 대한 권한이 없습니다.');
    }
  }, [navigate, access, mode, defaultPost?.fields?.id]);

  const EditForm = async (values: FormatModel) => {
    try {
      const res = await customHttp.put(`/api/posts/${id}`, values);

      if (res.status === 200 && AuthVerify()) {
        message.success('해당 게시글이 수정되었습니다.');

        const id = (res.data as { id: number }).id;

        navigate(`/project/${id}`);
      }
    } catch (err) {
      message.error('게시글이 수정되지 않았습니다.');
    }
  };

  const CreateForm = async (values: FormatModel) => {
    try {
      const { status, data } = await customHttp.post(`/api/posts`, values);

      if (status === 201) {
        message.success('프로젝트가 성공적으로 생성되었습니다! 🎉');

        const id = (data as { id: number }).id;
        navigate(`/project/${id}`);
      }
    } catch (err) {
      message.error('프로젝트가 생성되지 않았습니다.');
    }
  };

  const submitForm = async (values: FormModel) => {
    if (unSelectedItems(values, flavor, ALL_CARDS, description).length > 0) {
      return message.error(
        `${unSelectedItems(
          values,
          flavor,
          ALL_CARDS,
          description,
        )} 작성해주세요.`,
      );
    }

    const formattedValues = convertToFormatted(
      values,
      flavor,
      ALL_CARDS,
      description,
    );

    mode === 'edit' ? EditForm(formattedValues) : CreateForm(formattedValues);
  };

  const handleFlavor = (e: React.MouseEvent<HTMLElement>) => {
    if ((e.target as HTMLInputElement).nodeName !== 'INPUT') return;

    const checkbox = e.target as HTMLInputElement;

    checkbox.checked && setFlavor(checkbox.name);
  };

  return (
    <>
      <Nav />
      <Wrapper>
        {isModalOpen && (
          <PostFormModal
            setIsModalOpen={setIsModalOpen}
            additionalCards={additionalCards}
            setAdditionalCards={setAdditionalCards}
            primaryCards={primaryCards}
            setPrimaryCards={setPrimaryCards}
          />
        )}
        <Form
          form={form}
          onFinish={submitForm}
          style={{ position: 'relative' }}
          initialValues={defaultPost.fields}
        >
          <BasicInfo>
            <Title>
              <Num>1</Num>원하는 프로젝트 레시피를 알려주세요.
            </Title>
            <Line />
            <Main>
              <SelectList>
                {mode === 'edit' && (
                  <ListItem
                    name="status"
                    valuePropName="checked"
                    label={
                      <StyledLabel>
                        <StyledCircle />
                        &nbsp; 현재 모집 중
                      </StyledLabel>
                    }
                    colon={false}
                  >
                    <StatusSwitch unCheckedChildren="마감" />
                  </ListItem>
                )}

                <ListItem
                  name="category"
                  label={
                    <StyledLabel>
                      <StyledCircle />
                      &nbsp; 프로젝트 타입
                    </StyledLabel>
                  }
                  colon={false}
                >
                  <StyledSelect
                    bordered={false}
                    placeholder={
                      <div style={{ color: 'black' }}>스터디/프로젝트</div>
                    }
                  >
                    {CATEGORY.map((category) => (
                      <Option key={category} value={category}>
                        {category}
                      </Option>
                    ))}
                  </StyledSelect>
                </ListItem>
                <ListItem
                  name="place"
                  label={
                    <StyledLabel>
                      <StyledCircle />
                      &nbsp; 진행 방식
                    </StyledLabel>
                  }
                  colon={false}
                >
                  <StyledSelect
                    placeholder={
                      <div style={{ color: 'black' }}>온라인/오프라인</div>
                    }
                    bordered={false}
                  >
                    {PLACE.map((place) => (
                      <Option key={place} value={place}>
                        {place}
                      </Option>
                    ))}
                  </StyledSelect>
                </ListItem>
                <ListItem
                  name="stacks"
                  label={
                    <StyledLabel>
                      <StyledCircle />
                      &nbsp; 기술 스택
                    </StyledLabel>
                  }
                  colon={false}
                >
                  <StyledSelect
                    placeholder={
                      <div style={{ color: 'black' }}>
                        사용할 기술 스택을 골라주세요.
                      </div>
                    }
                    bordered={false}
                    mode="multiple"
                    optionLabelProp="label"
                    maxTagCount="responsive"
                    showArrow
                  >
                    {STACKS.map(({ value, title }) => (
                      <Option key={value} value={value}>
                        {title}
                      </Option>
                    ))}
                  </StyledSelect>
                </ListItem>
                <ListItem
                  name="number_of_front"
                  label={
                    <StyledLabel>
                      <StyledCircle />
                      &nbsp; 프론트엔드 모집 인원
                    </StyledLabel>
                  }
                  colon={false}
                >
                  <StyledSelect
                    bordered={false}
                    placeholder={
                      <div style={{ color: 'black' }}>인원 미정 ~ 5명 이상</div>
                    }
                  >
                    {NUM_OF_DEVELOPER.map((num) => (
                      <Option key={num} value={num}>
                        {num}
                      </Option>
                    ))}
                  </StyledSelect>
                </ListItem>
                <ListItem
                  name="number_of_back"
                  label={
                    <StyledLabel>
                      <StyledCircle />
                      &nbsp; 백엔드 모집 인원
                    </StyledLabel>
                  }
                  colon={false}
                >
                  <StyledSelect
                    bordered={false}
                    placeholder={
                      <div style={{ color: 'black' }}>인원 미정 ~ 5명 이상</div>
                    }
                  >
                    {NUM_OF_DEVELOPER.map((num) => (
                      <Option key={num} value={num}>
                        {num}
                      </Option>
                    ))}
                  </StyledSelect>
                </ListItem>
                <ListItem
                  name="period"
                  label={
                    <StyledLabel>
                      <StyledCircle />
                      &nbsp; 진행 기간
                    </StyledLabel>
                  }
                  colon={false}
                >
                  <StyledSelect
                    placeholder={
                      <div style={{ color: 'black' }}>
                        기간 미정 ~ 6개월 이상
                      </div>
                    }
                    bordered={false}
                  >
                    {PERIOD.map((num) => (
                      <Option key={num} value={num}>
                        {num}
                      </Option>
                    ))}
                  </StyledSelect>
                </ListItem>
                <ListItem
                  name="start_date"
                  label={
                    <StyledLabel>
                      <StyledCircle />
                      &nbsp; 시작 예정일
                    </StyledLabel>
                  }
                  colon={false}
                >
                  <StyledDatePicker placeholder="날짜를 골라주세요." />
                </ListItem>
                <ListItem
                  name="applyway"
                  label={
                    <StyledLabel>
                      <StyledCircle />
                      &nbsp; 연락 방법
                    </StyledLabel>
                  }
                  colon={false}
                >
                  <StyledSelect bordered={false} onChange={setApplyWay}>
                    {APPLY_WAY.map(({ title }) => (
                      <Option key={title} value={title}>
                        {title}
                      </Option>
                    ))}
                  </StyledSelect>
                </ListItem>
                <ListItem
                  name="applyway_info"
                  label={
                    <StyledLabel>
                      <StyledCircle />
                      &nbsp; 연락 주소
                    </StyledLabel>
                  }
                  colon={false}
                >
                  <ContactInput
                    placeholder={
                      APPLY_WAY?.find(({ title }) => title === applyWay)
                        ?.info || '카카오톡 오픈채팅'
                    }
                  />
                </ListItem>

                <ListItem>
                  <StyledLabel>
                    <StyledCircle />
                    &nbsp; 우리 팀 성향
                  </StyledLabel>
                  <TagBox>
                    <PickButton onClick={() => setIsModalOpen(true)}>
                      <ImPointRight /> &nbsp;
                      {primaryCards.length === 0
                        ? '팀 성향 고르기 Click!'
                        : '다시 고르기 Click!'}
                    </PickButton>
                    <CardList>
                      <CardBox>
                        {PRYMARY_CARDS.length > 0 && (
                          <CardBoxLabel>메인 재료</CardBoxLabel>
                        )}
                        {PRYMARY_CARDS?.map(({ image_url, name }, index) => (
                          <Card
                            id={name}
                            key={name + index}
                            image_url={image_url}
                            name={name}
                            size={'small'}
                          />
                        ))}
                      </CardBox>
                      <CardBox>
                        {ADDITIONAL_CARDS.length > 0 && (
                          <CardBoxLabel>추가 재료</CardBoxLabel>
                        )}
                        {ADDITIONAL_CARDS?.map(({ image_url, name }, index) => (
                          <Card
                            id={name}
                            key={name + index}
                            image_url={image_url}
                            name={name}
                            size={'small'}
                          />
                        ))}
                      </CardBox>
                    </CardList>
                  </TagBox>
                </ListItem>
              </SelectList>
              <FlavorBox>
                <FlavorTitle>프로젝트 맵기 조절</FlavorTitle>
                <FlavorList onClick={handleFlavor}>
                  {FLAVOR.map(({ title, description, image }) => {
                    return (
                      <FlavorListItem key={title}>
                        <StyledCheckbox
                          name={title}
                          checked={flavor === title}
                        ></StyledCheckbox>
                        <Description>
                          <div>
                            {title}
                            <Chili src={image} />
                          </div>
                          <span>{description}</span>
                        </Description>
                      </FlavorListItem>
                    );
                  })}
                </FlavorList>
              </FlavorBox>
            </Main>
          </BasicInfo>

          {primaryCards.length === 0 && additionalCards.length === 0 && (
            <MiddleLine />
          )}
          <DetailInfo>
            <Title>
              <Num>2</Num>프로젝트에 대해 소개해주세요.
            </Title>
            <Line />
            <Item
              name="title"
              label={<TitleLabel>제목</TitleLabel>}
              colon={false}
            >
              <TitleInput type="text" name="title"></TitleInput>
            </Item>
            <StyledLabel>자세한 소개</StyledLabel>
            <EditorBox>
              <Editor
                initialValue={defaultPost?.description}
                apiKey={TINYMCE_API_KEY}
                init={{
                  referrer_policy: 'origin',
                  export_cors_hosts: [`${BASE_URL}`],
                  placeholder:
                    '프로젝트에 대해 소개해주세요. (이미지를 올리고 싶다면 드래그를 해주세요!)',
                  height: 700,
                  paste_data_images: true,
                  menubar: false,
                  toolbar:
                    'undo redo  | styles | styleselect  | forecolor| fontsizeselect  | bold italic | alignleft aligncenter alignright alignjustify | outdent indent | code',
                  resize: false,
                }}
                onEditorChange={(content: string) => setDescription(content)}
              />
            </EditorBox>
          </DetailInfo>
          <ButtonBox>
            <StyledButton
              onClick={() => navigate('/myposts')}
              style={{ background: '#99999' }}
            >
              취소
            </StyledButton>
            <StyledButton
              htmlType="submit"
              style={{ background: theme.mainGreen, color: '#fff' }}
            >
              {mode === 'edit' ? '수정' : '등록'}
            </StyledButton>
          </ButtonBox>
        </Form>
      </Wrapper>
    </>
  );
};

export default PostForm;

const Wrapper = styled.div`
  ${({ theme }) => theme.wrapper()}
  padding : 0 35px;

  @media screen and ${devices.laptop} {
    width: 800px;
    padding: 0px;
  }

  @media screen and ${devices.tablet} {
    width: 650px;
  }

  @media screen and ${devices.mobile} {
    width: 500px;
    padding-right: 10px;
  }
`;

//BasicInfo
const BasicInfo = styled.div`
  margin: 120px 0 160px 0;

  @media screen and ${devices.laptop} {
    margin: 110px 20px 160px 20px;
  }

  @media screen and ${devices.tablet} {
    margin: 100px 20px 160px 20px;
  }
`;

const Title = styled.h1`
  font-size: 35px;

  @media screen and ${devices.laptop} {
    font-size: ${theme.fontMedium};
  }

  @media screen and ${devices.tablet} {
    font-size: ${theme.fontSemiMedium};
  }
`;

const Num = styled.span`
  display: inline-block;
  margin-right: 10px;
  text-align: center;
  line-height: 50px;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  color: #fff;
  background-color: ${theme.mainGreen};

  @media screen and ${devices.laptop} {
    width: 40px;
    height: 40px;
    line-height: 40px;
  }

  @media screen and ${devices.tablet} {
    width: 30px;
    height: 30px;
    line-height: 30px;
  }
`;

const Line = styled.div`
  width: 100%;
  height: 1px;
  margin: 20px 0;
  background-color: #dfe1e6;
`;

const MiddleLine = styled.div`
  width: 100%;
  margin-top: -120px;

  @media screen and ${devices.laptop} {
    display: block;
  }
`;

const Main = styled.main`
  display: flex;

  @media screen and ${devices.tablet} {
    display: block;
  }
`;

const StatusSwitch = styled(Switch)`
  @media screen and ${devices.mobile} {
    left: 30px;
  }
`;

const SelectList = styled.ul`
  width: 100%;
`;

const ListItem = styled(Item)`
  position: relative;
  font-family: ‘Black Han Sans’, sans-serif;
  margin: 30px 15px 30px -40px;
`;

const StyledLabel = styled.div`
  font-family: ‘Black Han Sans’, sans-serif;
  font-size: ${theme.fontSemiMedium};
  font-weight: ${theme.weightMiddle};
  width: 200px;
  text-align: left;

  @media screen and ${devices.tablet} {
    font-size: 17px;
    margin-left: 20px;
  }

  @media screen and ${devices.mobile} {
    font-size: 15px;
  }
`;

const StyledSelect = styled(Select)`
  padding: 0 10px;
  right: 0px;
  height: 35px;
  border: 1px transparent solid;
  border-radius: 3px;
  background-color: #f4f5f7;
  cursor: pointer;

  @media screen and ${devices.tablet} {
    font-size: 17px;
    margin-left: 20px;
  }

  @media screen and ${devices.mobile} {
    font-size: 15px;
  }
`;

const StyledCircle = styled(VscCircleOutline)`
  font-size: ${theme.fontSmall};

  @media screen and ${devices.mobile} {
    font-size: 11px;
  }
`;

const ContactInput = styled.input`
  padding: 0 10px 0 20px;
  width: 100%;
  height: 35px;
  border: 1px transparent solid;
  border-radius: 3px;
  background-color: #f4f5f7;
  font-size: 14px;

  @media screen and ${devices.tablet} {
    font-size: 17px;
    margin-left: 20px;
  }

  @media screen and ${devices.mobile} {
    font-size: 15px;
  }
`;

const TagBox = styled.div`
  font-family: 'Jua';
  position: relative;
  padding: 0 10px;
  transform: translate(180px, -30px);
  width: 100%;

  @media screen and ${devices.laptop} {
    transform: translate(240px, -30px);
  }

  @media screen and ${devices.tablet} {
    transform: translate(-10px, 10px);
  }

  @media screen and ${devices.mobile} {
    width: 95%;
  }
`;

const CardList = styled.div`
  transform: translateX(10px);
  position: absolute;
  width: 100%;

  @media screen and ${devices.laptop} {
    transform: translateX(-50px);
    width: 120%;
  }

  @media screen and ${devices.tablet} {
    position: relative;
    width: 95%;
    transform: translate(20px, 10px);
  }
`;

const CardBox = styled.div`
  position: relative;
  margin: 12px 0 0 0;
  border: transparant 1px solid;
  border-radius: 10px;
  background: #f4f5f7;

  @media screen and ${devices.laptop} {
    width: 550px;
  }

  @media screen and ${devices.mobile} {
    width: 440px;
  }
`;

const CardBoxLabel = styled.span`
  position: absolute;
  left: 20px;
  top: -10px;
  font-size: ${theme.fontMicro};
  color: ${theme.mainViolet};
`;

const StyledDatePicker = styled(DatePicker)`
  padding: 0 10px 0 20px;
  width: 100%;
  height: 35px;
  border: 1px transparent solid;
  border-radius: 3px;
  background-color: #f4f5f7;

  @media screen and ${devices.tablet} {
    font-size: 17px;
    margin-left: 20px;
  }

  @media screen and ${devices.mobile} {
    font-size: 15px;
  }
`;

const PickButton = styled(Button)`
  font-family: ‘Black Han Sans’, sans-serif;
  margin: 10px 0 10px 20px;
  display: block;
  padding: 0 10px;
  height: 35px;
  transform: translate(-5px, -15px);
  border-radius: 30px;
  border: 0;
  color: #fff;
  font-size: 16px;
  font-weight: ${theme.weightBold};
  background-color: ${theme.mainViolet};

  cursor: pointer;

  @media screen and ${devices.laptop} {
    transform: translate(-65px, -15px);
    font-size: 14px;
  }

  @media screen and ${devices.tablet} {
    transform: translate(0px, 0px);
    font-size: 12px;
  }
`;

const FlavorBox = styled.div`
  margin: 25px 0;
  padding: 30px 20px;
  width: 350px;
  height: 350px;
  background-color: #f4f5f7;
  border-radius: 3px;
  box-shadow: 7px 5px 7px -6px #4e4e4e;

  @media screen and ${devices.tablet} {
    margin-top: 50px;
    transform: translateX(125px);
  }

  @media screen and ${devices.mobile} {
    margin-top: 50px;
    transform: translateX(50px);
    padding: 20px;
    height: 320px;
  }
`;

const FlavorTitle = styled.h2`
  font-size: ${theme.fontSemiMedium};
  text-align: center;

  @media screen and ${devices.mobile} {
    font-size: ${theme.fontSmall};
  }
`;

const FlavorList = styled.ul`
  margin: 30px 0;
`;

const FlavorListItem = styled.li`
  display: flex;
  margin: 30px 0;
`;

const StyledCheckbox = styled(Checkbox)`
  margin-right: 10px;
`;

const Description = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  span {
    margin-top: 6px;
    font-size: 14px;
  }

  @media screen and ${devices.mobile} {
    font-size: 14px;
    span {
      font-size: 12px;
    }
  }
`;

const Chili = styled.img`
  position: absolute;
  top: -10px;
  left: 45px;
  margin: 0 2px;
  width: 35px;
  height: 35px;
`;

// DetailInfo
const DetailInfo = styled.div`
  margin: 80px 0;

  @media screen and ${devices.laptop} {
    margin: 210px 20px 100px 20px;
  }

  @media screen and ${devices.tablet} {
    margin: 70px 20px 100px 20px;
  }

  @media screen and ${devices.mobile} {
    margin-top: 20px;
  }
`;

const TitleLabel = styled.div`
  font-family: ‘Black Han Sans’, sans-serif;
  font-size: ${theme.fontSemiMedium};
  font-weight: ${theme.weightMiddle};

  @media screen and ${devices.tablet} {
    font-size: 17px;
    margin-left: 20px;
  }

  @media screen and ${devices.mobile} {
    font-size: 15px;
  }
`;

const TitleInput = styled.input`
  display: block;
  font-family: ‘Black Han Sans’, sans-serif;
  padding: 20px;
  width: 100%;
  height: 40px;
  font-size: ${theme.fontSemiMedium};
  border: 1px solid #dfe1e6;
  border-radius: 3px;
`;

const EditorBox = styled.div`
  font-family: ‘Black Han Sans’, sans-serif;
  margin: 20px 0 100px 0;
  width: 100%;
  font-size: ${theme.fontSemiMedium};
  border-radius: 3px;
  resize: none;
`;

const ButtonBox = styled.div`
  font-family: 'Jua', sans-serif;
  position: absolute;
  right: 10px;
  bottom: -60px;
`;

const StyledButton = styled(Button)`
  margin: 0 10px;
  padding: 10px;
  width: 80px;
  height: 50px;
  font-size: ${theme.fontRegular};
  font-weight: ${theme.weightSemiBold};
  border-radius: 3px;
  border: 0;

  @media screen and ${devices.tablet} {
    width: 60px;
    font-size: ${theme.fontSmall};
  }
`;
