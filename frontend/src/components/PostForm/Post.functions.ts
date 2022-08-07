import { OPTIONS, OPTION_TITLES } from 'assets/data/Options.constant';
import { FormModel } from 'components/PostForm/PostForm.model';

const { CARD_LIST } = OPTIONS;

export const convertToImgCard = (cards: string[]) =>
  cards.map((name) => {
    return {
      name,
      image_url: CARD_LIST.find((card) => card.name === name)?.image_url,
    };
  });

export const unSelectedItems = (
  values: FormModel,
  flavor?: string,
  answers?: { description: string; is_primary: boolean }[],
  description?: string,
) => {
  const unSelectedItems = Object.entries({
    ...values,
    flavor,
    answers,
    description,
  })
    .filter(([_, value]) => value === undefined || value === '')
    .map(([key, _]) => (OPTION_TITLES as any)[key])
    .join(', ');

  return unSelectedItems;
};

export const convertToFormatted = (
  values: FormModel,
  flavor?: string,
  answers?: { description: string; is_primary: boolean }[],
  description?: string,
) => {
  const {
    applyway,
    applyway_info,
    category,
    number_of_back,
    number_of_front,
    period,
    place,
    title,
    stacks,
    status,
  } = values;

  const formattedValues = {
    category,
    number_of_back,
    number_of_front,
    period,
    place,
    title,
    start_date: values.start_date.format('YYYY-MM-DD'),
    answers,
    stacks,
    flavor,
    description,
    applyway: {
      title: applyway,
      description: applyway_info,
    },
    status: status === false || status === 'inactive' ? 'inactive' : 'active',
  };

  return formattedValues;
};
