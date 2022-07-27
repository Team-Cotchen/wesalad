export interface ModalProps {
  handleClose: () => void;
  visible?: boolean;
  name?: string;
}

export interface ITitle {
  fontSize?: string;
  marginBottom?: string;
}

export interface IProgressBar {
  min: number;
  max: number;
  value: number;
}

export interface IBasicInfo {
  name: string;
  ordinal_number: number;
  answers: string;
  stacks: string;
}

export interface IInfoSection {
  handleBasicInfo: (value: string, name: string) => void;
  handleLoginStep: () => void;
  name?: string;
}

export interface IQuestionSection {
  questionNum: number;
  handleBtnNum(num: number, name: string): void;
  fetchByUserInfo?: () => void;
}

export interface IFetchResultData {
  id?: number;
  google_account?: {
    sub: string;
    email: string;
    image_url: string;
  };
  user_answers: [
    {
      answer: {
        content: string;
        description: string;
      };
    },
  ];
  user_stacks: [
    {
      stack: {
        title: string;
        description: string;
        image_url: string;
      };
    },
  ];
  token?: {
    refresh: string;
    access: string;
  };
  last_login: null;
  created_at: string;
  updated_at: string;
  name: string;
  ordinal_number: number;
  is_active: boolean;
  is_admin: boolean;
  groups: string[];
  user_permissions: string[];
}
