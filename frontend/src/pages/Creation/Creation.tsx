import React, { FunctionComponent } from 'react';
import PostForm from 'components/PostForm/PostForm';
import moment from 'moment';

const Creation: FunctionComponent = () => {
  const fields = {
    category: undefined,
    stacks: undefined,
    applyway: undefined,
    applyway_info: '',
    place: undefined,
    title: '',
    number_of_front: undefined,
    number_of_back: undefined,
    period: undefined,
    description: '',
    start_date: moment(new Date(), 'YYYY-MM-DD'),
    flavor: '중간맛',
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
