import React, { FunctionComponent } from 'react';
import PostForm from 'components/PostForm/PostForm';
import moment from 'moment';

const Creation: FunctionComponent = () => {
  const fields = {
    category: '스터디/프로젝트',
    stacks: ['javascript'],
    applyway: '카카오톡 오픈 채팅',
    applyway_info: '',
    place: '온라인/오프라인',
    title: '',
    number_of_front: '인원 미정 ~ 5명 이상',
    number_of_back: '인원 미정 ~ 5명 이상',
    period: '기간 미정 ~ 6개월 이상',
    description: '',
    start_date: moment(new Date(), 'YYYY-MM-DD'),
  };

  const postToCreate = {
    fields,
    description: '',
    primary: [''],
    additional: [''],
  };

  return (
    <>
      <PostForm mode="creation" defaultPost={postToCreate} />
    </>
  );
};

export default Creation;
