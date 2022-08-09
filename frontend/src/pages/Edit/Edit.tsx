import { Spin, message } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import axios from 'axios';
import moment from 'moment';
import React, {
  FunctionComponent,
  useEffect,
  useState,
  useCallback,
} from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import { BASE_URL } from 'config';

import PostForm from 'components/PostForm/PostForm';

import type { PostModel } from 'components/PostForm/PostForm.model';
import type { DetailModel } from 'pages/Detail/Detail.model';

const Edit: FunctionComponent = () => {
  const { id } = useParams();

  const [postToEdit, setPostToEdit] = useState<PostModel>();

  useEffect(() => {
    const getData = async () => {
      try {
        const { data } = await axios.get(`${BASE_URL}/api/posts/${id}`);
        convertToPostData(data);
      } catch (err) {
        console.log(err);
      }
    };
    getData();
  }, [id]);

  const convertToPostData = (data: DetailModel) => {
    const {
      category,
      description,
      number_of_back,
      number_of_front,
      period,
      post_answer,
      post_applyway,
      post_place,
      post_stack,
      start_date,
      title,
      post_flavor,
      status,
      user,
    } = data;

    const fields = {
      category,
      stacks: post_stack.map(({ title }) => title),
      applyway: post_applyway.title,
      applyway_info: post_applyway.description,
      place: post_place.title,
      title,
      number_of_front,
      number_of_back,
      period,
      start_date: moment(start_date, 'YYYY-MM-DD'),
      flavor: post_flavor?.title,
      status: status === 'active' ? true : false,
      id: user.id,
    };

    const primary =
      post_answer?.[0]?.primary_answer?.map(({ description }) => description) ||
      [];

    const additional =
      post_answer?.[0]?.secondary_answer?.map(
        ({ description }) => description,
      ) || [];

    setPostToEdit({ fields, description, primary, additional });
  };

  return (
    <>
      {postToEdit ? (
        <PostForm mode="edit" defaultPost={postToEdit} />
      ) : (
        <div style={{ position: 'absolute', top: '45%', right: '45%' }}>
          <Spin indicator={<LoadingOutlined style={{ fontSize: '40px' }} />} />
        </div>
      )}
    </>
  );
};

export default Edit;
