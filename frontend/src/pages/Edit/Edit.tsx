import axios from 'axios';
import moment from 'moment';
import React, { FunctionComponent, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import PostForm from 'components/PostForm/PostForm';

import { BASE_URL } from 'config';

import type { DetailModel } from 'pages/Detail/DetailModel';
import type { PostModel } from 'components/PostForm/PostForm.model';

const Edit: FunctionComponent = () => {
  const { id } = useParams();

  const [postToEdit, setPostToEdit] = useState<PostModel>();

  const getData = async () => {
    try {
      //   const { data } = await axios.get(`${BASE_URL}/posts/${id}`);

      //mock data
      const { data } = await axios.get('/data/cardsdata.json');

      convertToPostData(data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getData();
  }, []);

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
    } = data;

    const fields = {
      category,
      stacks: post_stack.map(({ title }) => title),
      applyway: post_applyway.map(({ title }) => title)[0],
      applyway_info: post_applyway.map(({ description }) => description)[0],
      place: post_place,
      title,
      number_of_front,
      number_of_back,
      period,
      start_date: moment(start_date, 'YYYY-MM-DD'),
    };

    const primary = post_answer
      .filter(({ is_primary }) => is_primary === true)
      .map(({ answer }) => answer.description);

    const additional = post_answer
      .filter(({ is_primary }) => is_primary === false)
      .map(({ answer }) => answer.description);

    setPostToEdit({ fields, description, primary, additional });
  };

  return (
    <>{postToEdit && <PostForm mode="edit" defaultPost={postToEdit} />} ;</>
  );
};

export default Edit;
