import axios from 'axios';

// 통신과 관련한 함수 모아놓은 곳

export const getDetails = async () => {
  try {
    // const { data } = await axios.get(`${BASE_URL}/posts/${id}`);

    const { data } = await axios.get(`/data/cardsdata.json`);

    return data;
  } catch (err) {
    console.log(err);
  }
};

// 토큰 다시 저장 + 해당 함수로 요청 again
// setAccessToken 해주고 나서 요청
export const requestAgain = (func: any, data: FormData | null) => {
  func(data);
};

// 이 함수는 특정 status 나올 시 다시 요청해주는 함수 - createForm, editForm, deletePost 에 사용될 예정
