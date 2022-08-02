import { Select, DatePicker, Checkbox, message, Form, Button } from 'antd';
import axios from 'axios';
import React, { useState, FunctionComponent, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ImPointRight } from 'react-icons/im';
import { VscCircleOutline } from 'react-icons/vsc';
import { Editor } from '@tinymce/tinymce-react';
import styled from 'styled-components';

import PostFormModal from 'components/PostForm/PostFormModal';
import Card from 'components/Card';
import Nav from 'components/Nav/Nav';

import theme from 'styles/theme';
import { devices } from 'styles/devices';

import { BASE_URL, TINYMCE_API_KEY } from 'config';

import type {
  OptionModel,
  FormModel,
  PostModel,
} from 'components/PostForm/PostForm.model';

const { Option } = Select;
const { Item } = Form;

interface Props {
  mode: 'edit' | 'creation';
  defaultPost: PostModel;
}

const PostForm: FunctionComponent<Props> = ({ mode, defaultPost }: Props) => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [options, setOptions] = useState<OptionModel>({
    CATEGORY: [],
    PLACE: [],
    NUM_OF_DEVELOPER: [],
    PERIOD: [],
    APPLY_WAY: [],
    FLAVOR: [],
    STACKS: [],
    CARD_LIST: [],
  });

  const {
    CATEGORY,
    PLACE,
    NUM_OF_DEVELOPER,
    PERIOD,
    APPLY_WAY,
    FLAVOR,
    STACKS,
    CARD_LIST,
  } = options;

  const [additionalCards, setAdditionalCards] = useState<string[]>(
    mode === 'edit' ? defaultPost.additional : [],
  );
  const [primaryCards, setPrimaryCards] = useState<string[]>(
    mode === 'edit' ? defaultPost.primary : [],
  );
  const [applyWay, setApplyWay] = useState<unknown>();
  const [flavor, setFlavor] = useState('');
  const [description, setDescription] = useState('');

  const PRYMARY_CARDS = primaryCards.map((name) => {
    return {
      name,
      image_url: CARD_LIST.find((card) => card.name === name)?.image_url,
    };
  });

  const ADDITIONAL_CARDS = additionalCards.map((name) => {
    return {
      name,
      image_url: CARD_LIST.find((card) => card.name === name)?.image_url,
    };
  });

  const ALL_CARDS = useMemo(
    () =>
      [...primaryCards, ...additionalCards].map((item) => {
        return { description: item, is_primary: primaryCards.includes(item) };
      }),
    [primaryCards, additionalCards],
  );

  useEffect(() => {
    const getOptions = async () => {
      const { data } = await axios.get('/data/constantOptions.json');

      setOptions(data);
    };
    getOptions();
  }, []);

  const submitForm = async (values: FormModel) => {
    try {
      const formData = new FormData();

      const formattedValues = {
        ...values,
        start_date: values.start_date.format('YYYY-MM-DD'),
        answers: JSON.stringify(ALL_CARDS),
        stacks: JSON.stringify(values.stacks),
        description,
      };

      Object.entries(formattedValues).forEach(([key, value]) =>
        formData.append(key, value),
      );

      const res = await axios({
        method: mode === 'edit' ? 'put' : 'post',
        url: `${BASE_URL}/posts/create`,
        headers: {
          'Content-Type': `multipart/form-data`,
        },
        data: formData,
      });

      if (res.status === 201) {
        message.success('프로젝트가 성공적으로 생성되었습니다! 🎉');

        const id = (res.data as { id: number }).id;

        navigate(`/project/${id}`);
      }
    } catch (err) {
      console.log(err);
      message.error('프로젝트가 생성되지 않았습니다.');
    }
  };

  const handleFlavor = (e: React.MouseEvent<HTMLElement>) => {
    if ((e.target as HTMLInputElement).nodeName !== 'INPUT') return;

    const checkbox = e.target as HTMLInputElement;

    checkbox.checked && setFlavor(checkbox.name);
  };

  const handleEditorChange = (content: string) => {
    setDescription(content);
  };

  const openModal = () => {
    setIsModalOpen(true);
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
            CARD_LIST={CARD_LIST}
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
            <Line></Line>
            <Main>
              <SelectList>
                <ListItem
                  name="category"
                  label={
                    <StyledLabel>
                      <StyledCircle />
                      &nbsp; 프로젝트 타입
                    </StyledLabel>
                  }
                >
                  <StyledSelect bordered={false}>
                    {CATEGORY.map((category) => (
                      <Option key={category} value={category || 'category'}>
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
                      &nbsp; 진행방식
                    </StyledLabel>
                  }
                >
                  <StyledSelect bordered={false}>
                    {PLACE.map((place) => (
                      <Option key={place} value={place || 'place'}>
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
                >
                  <StyledSelect
                    placeholder="사용할 기술 스택을 골라주세요."
                    bordered={false}
                    mode="multiple"
                    optionLabelProp="label"
                    maxTagCount="responsive"
                    showArrow
                  >
                    {STACKS.map(({ value, title }) => (
                      <Option key={value} value={value || 'stack'}>
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
                >
                  <StyledSelect bordered={false}>
                    {NUM_OF_DEVELOPER.map((num) => (
                      <Option key={num} value={num || '0'}>
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
                >
                  <StyledSelect bordered={false}>
                    {NUM_OF_DEVELOPER.map((num) => (
                      <Option key={num} value={num || '0'}>
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
                >
                  <StyledSelect bordered={false}>
                    {PERIOD.map((num) => (
                      <Option key={num} value={num || '0'}>
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
                >
                  <StyledSelect bordered={false} onChange={setApplyWay}>
                    {APPLY_WAY.map(({ title }) => (
                      <Option key={title} value={title || 'title'}>
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
                >
                  <ContactInput
                    placeholder={
                      APPLY_WAY?.find(({ title }) => title === applyWay)
                        ?.info || '카카오톡 오픈 채팅'
                    }
                  />
                </ListItem>

                <ListItem>
                  <StyledLabel>
                    <StyledCircle />
                    &nbsp; 우리 팀 성향
                  </StyledLabel>
                  <TagBox>
                    <PickButton onClick={openModal}>
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
            <MiddleLine></MiddleLine>
          )}
          <DetailInfo>
            <Title>
              <Num>2</Num>프로젝트에 대해 소개해주세요.
            </Title>
            <Line></Line>
            <Item name="title" label={<TitleLabel>제목</TitleLabel>}>
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
                  placeholder: '프로젝트에 대해 소개해주세요.',
                  height: 700,
                  menubar: true,
                  plugins: ['image'],
                  paste_data_images: true,
                  automatic_uploads: true,
                  images_upload_url: `${BASE_URL}/posts/create`, // 서버주소 이어야 하지 않을까? => 만약 안되면 image 아이콘 없애고 drag 만 되는 걸로 바꾸기
                  toolbar:
                    'undo redo | image | styles | styleselect  | fontsizeselect  | bold italic | alignleft aligncenter alignright alignjustify | outdent indent ',
                  resize: false,
                }}
                onEditorChange={handleEditorChange}
              />
            </EditorBox>
          </DetailInfo>
          <ButtonBox>
            <StyledButton style={{ background: '#99999' }}>취소</StyledButton>
            <StyledButton
              htmlType="submit"
              type="ghost"
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

  @media screen and ${devices.laptop} {
    overflow-x: hidden;
    width: 900px;
  }

  @media screen and ${devices.tablet} {
    width: 720px;
  }

  @media screen and ${devices.mobile} {
    width: 500px;
  }
`;

//BasicInfo
const BasicInfo = styled.div`
  margin: 120px 0 160px 0;

  @media screen and ${devices.laptop} {
    margin: 100px 20px 160px 20px;
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
`;

const Main = styled.main`
  display: flex;

  @media screen and ${devices.tablet} {
    display: block;
  }
`;

const SelectList = styled.ul`
  width: 690px;

  @media screen and ${devices.mobile} {
    width: 480px;
  }
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
`;

const CardBoxLabel = styled.span`
  position: absolute;
  left: 20px;
  top: -5px;
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
`;

const PickButton = styled.button`
  font-family: ‘Black Han Sans’, sans-serif;
  margin: 10px 0 10px 20px;
  display: block;
  padding: 0 10px;
  right: 30px;
  height: 35px;
  border-radius: 30px;
  border: 0;
  color: #fff;
  font-weight: ${theme.weightBold};
  background-color: ${theme.mainViolet};
  cursor: pointer;

  @media screen and ${devices.laptop} {
    transform: translate(-70px, -10px);
  }

  @media screen and ${devices.tablet} {
    transform: translate(0px, 0px);
    font-size: 12px;
  }
`;

const FlavorBox = styled.div`
  margin: 25px 0;
  padding: 30px;
  width: 350px;
  height: 350px;
  background-color: #f4f5f7;
  border-radius: 3px;
  box-shadow: 7px 5px 7px -6px #4e4e4e;

  @media screen and ${devices.tablet} {
    margin-top: 50px;
    transform: translateX(50%);
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
    margin-top: 15px;
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
    margin: 80px 20px 100px 20px;
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
  right: 0;
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
