export interface OptionModel {
  CATEGORY: string[];
  PLACE: string[];
  NUM_OF_DEVELOPER: string[];
  PERIOD: string[];
  APPLY_WAY: { title: string; info: string }[];
  FLAVOR: { title: string; description: string; image: string }[];
  STACKS: { value: string; title: string }[];
  CARD_LIST: { image_url: string; name: string }[];
}

export interface FormModel {
  category: string | undefined;
  stacks: string[] | undefined;
  applyway: string | undefined;
  applyway_info: string | undefined;
  place: string | undefined;
  title: string | undefined;
  number_of_front: string | undefined;
  number_of_back: string | undefined;
  period: string | undefined;
  start_date: moment.Moment;
  flavor: string | undefined;
  status?: string | boolean;
}

export interface PostModel {
  fields: FormModel;
  description: string;
  primary: string[];
  additional: string[];
}

export interface FormatModel {
  answers: { description: string; is_primary: boolean }[] | undefined;
  applyway: { title: string | undefined; description: string | undefined };
  category: string | undefined;
  number_of_back: string | undefined;
  number_of_front: string | undefined;
  period: string | undefined;
  place: string | undefined;
  title: string | undefined;
  stacks: string[] | undefined;
  start_date: string;
  status: string;
}
