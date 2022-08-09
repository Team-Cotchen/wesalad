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
  category?: string;
  stacks?: string[];
  applyway?: string;
  applyway_info?: string;
  place?: string;
  title?: string;
  number_of_front?: string;
  number_of_back?: string;
  period?: string;
  start_date: moment.Moment;
  flavor?: string;
  status?: string | boolean;
  id?: string;
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
