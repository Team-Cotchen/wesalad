export interface DetailModel {
  id: number;
  category: '스터디' | '프로젝트';
  post_answer: {
    is_primary: boolean;
    answer: {
      question: string;
      content: string;
      description: string;
      image_url: string;
    };
  }[];
  post_stack: {
    title: string;
    image_url: string;
    description: string;
  }[];
  post_applyway: [
    {
      title: '이메일' | '문자메세지' | '카카오톡 오픈채팅';
      description: string;
    },
  ];
  post_place: '온라인' | '오프라인';
  user: {
    id: string;
    created_at: string;
    updated_at: string;
    name: string;
    ordinal_number: number;
    google_account: number;
    image_url: string;
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
