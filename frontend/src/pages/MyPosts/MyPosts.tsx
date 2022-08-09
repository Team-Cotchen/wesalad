import { message, Table, Tag, Space, Popconfirm, Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import styled from 'styled-components';
import theme from 'styles/theme';

import { getToken } from 'config';
import Nav from 'components/Nav/Nav';
import customHttp, { AuthVerify } from 'utils/Axios';
import { DetailModel } from 'pages/Detail/Detail.model';

import { devices } from 'styles/devices';

const MyPosts = () => {
  const navigate = useNavigate();
  const { access } = getToken();
  const [myposts, setMyposts] = useState<DetailModel[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (access === '' || access === null) {
      message.warning('로그인이 필요합니다.');
      return navigate('/');
    }

    if (AuthVerify() === 'Refresh Token Expired') {
      message.warning('로그인이 만료되었습니다. 다시 로그인 해주세요.');
      return navigate('/');
    }
  }, [navigate, access]);

  useEffect(() => {
    getMyPosts();
  }, []);

  const getMyPosts = async () => {
    setIsLoading(true);
    try {
      const { data } = await customHttp.get(`/api/users/posts`);
      setMyposts(
        data
          .filter(({ status }: { status: string }) => status !== 'deleted')
          .sort((a: DetailModel, b: DetailModel) => b.id - a.id),
      );
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  const deletePost = async (id: string) => {
    try {
      const res = await customHttp.delete(`/api/posts/${id}`);

      if (res.status === 204) {
        message.success('해당 게시글이 삭제되었습니다.');
        getMyPosts();
      }
    } catch (err) {
      if (
        (err as { response: { data: string } }).response.data ===
        'POST_DOES_NOT_EXIST'
      )
        message.error('해당 게시글은 이미 삭제되었습니다.');
      else
        message.error('해당 게시글이 삭제되지 않았습니다. 다시 시도해주세요.');
    }
  };

  const columns = [
    {
      title: <ColumnsTitle>번호</ColumnsTitle>,
      dataIndex: 'id',
      key: 'id',
      render: (id: string) => <ColumnsContent>{id}</ColumnsContent>,
    },
    {
      title: <ColumnsTitle>제목</ColumnsTitle>,
      dataIndex: 'title',
      key: 'title',
      render: (title: string) => <ColumnsContent>{title}</ColumnsContent>,
    },
    {
      title: <ColumnsTitle>작성일</ColumnsTitle>,
      dataIndex: 'created_at',
      key: 'created_at',
      render: (date: string) => (
        <ColumnsContent>
          {dayjs(date).format('YYYY년 MM월 DD일 ')}
        </ColumnsContent>
      ),
    },
    {
      title: <ColumnsTitle>상태</ColumnsTitle>,
      dataIndex: 'status',
      key: 'status',
      render: (status: string) =>
        status === 'active' ? (
          <Tag color="blue">현재 모집 중</Tag>
        ) : (
          <Tag color="gray">모집 마감</Tag>
        ),
    },
    {
      title: <ColumnsTitle>설정</ColumnsTitle>,
      dataIndex: 'id',
      key: 'settings',
      textAlign: 'center',
      render: (id: string) => (
        <Space>
          <Button name="edit" onClick={() => navigate(`/edit/${id}`)}>
            수정
          </Button>
          <Popconfirm
            title="삭제하시겠습니까?"
            okText="예"
            cancelText="아니오"
            onConfirm={() => deletePost(id)}
          >
            <Button name="delete">삭제</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Nav />
      <Wrapper>
        <Title>내 작성글</Title>
        {!isLoading ? (
          <Table
            columns={columns}
            dataSource={myposts}
            rowKey={({ id }) => id}
            style={{ fontSize: '3px' }}
            scroll={{ x: 'max-content' }}
            onRow={({ id }) => {
              return {
                onClick: (e) => {
                  if ((e.target as Element).closest('button')) return;
                  navigate(`/project/${id}`);
                },
              };
            }}
          />
        ) : (
          <div style={{ position: 'absolute', top: '45%', right: '45%' }}>
            <Spin
              indicator={<LoadingOutlined style={{ fontSize: '40px' }} />}
            />
          </div>
        )}
      </Wrapper>
    </div>
  );
};

export default MyPosts;

const Wrapper = styled.div`
  ${theme.wrapper()};
  padding: 6rem;

  @media screen and ${devices.laptop} {
    width: 800px;
    padding: 6rem 40px;
  }

  @media screen and ${devices.tablet} {
    width: 600px;
    padding: 6rem 10px;
  }

  @media screen and ${devices.mobile} {
    width: 500px;
  }
`;

const Title = styled.h1`
  @media screen and ${devices.tablet} {
    font-size: ${theme.fontMedium};
  }
`;

const ColumnsTitle = styled.div`
  @media screen and ${devices.tablet} {
    font-size: 15px;
  }

  @media screen and ${devices.mobile} {
    font-size: 13px;
  }
`;

const ColumnsContent = styled.div`
  color: #404040;
  @media screen and ${devices.tablet} {
    font-size: 14px;
  }

  @media screen and ${devices.mobile} {
    font-size: 13px;
  }
`;

const Button = styled.button<{ name?: 'edit' | 'delete' }>`
  margin-right: ${({ name }) => (name === 'edit' ? '0' : '-40px')};
  padding: 5px 10px;
  background: ${({ name }) => (name === 'edit' ? theme.mainGreen : 'gray')};
  font-size: ${theme.fontRegular};
  color: #fff;
  border: 0;
  border-radius: 10px;
  cursor: pointer;

  @media screen and ${devices.laptop} {
    margin-right: ${({ name }) => (name === 'edit' ? '0' : '-20px')};
  }

  @media screen and ${devices.tablet} {
    padding: 4px;
    font-size: 14px;
  }
`;
