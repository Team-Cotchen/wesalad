export interface DetailModel {
  id: number;
  category: '스터디' | '프로젝트';
  post_answer: [
    {
      primary_answer: {
        id: number;
        description: string;
        image_url: string;
      }[];
      secondary_answer: {
        id: number;
        description: string;
        image_url: string;
      }[];
    },
  ];
  post_stack: {
    id: number;
    title: string;
    image_url: string;
    description: string;
  }[];
  post_applyway: {
    id: number;
    title: '이메일' | '문자메세지' | '카카오톡 오픈채팅';
    description: string;
  };
  post_flavor: {
    id: number;
    description: string;
    image_url: string;
    title: string;
  };
  post_place: {
    id: number;
    title: '온라인' | '오프라인';
  };
  user: {
    id: string;
    name: string;
    image_url: string;
    ordinal_number: number;
  };
  created_at: string;
  updated_at: string;
  title: string;
  number_of_front: string;
  number_of_back: string;
  period: string;
  description: string;
  start_date: string;
  status: string;
}
