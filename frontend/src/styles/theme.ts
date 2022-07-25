import { DefaultTheme } from 'styled-components';

const theme: DefaultTheme = {
  mainGreen: '#2DE466',
  lightGreen: '#55B976',
  mainViolet: '#693BFB',
  lightGray: '#dfe1e6',

  fontLarge: '48px',
  fontMedium: '28px',
  fontSemiMedium: '20px',
  fontRegular: '18px',
  fontSmall: '16px',
  fontMicro: '14px',

  weightBold: 700,
  weightSemiBold: 600,
  weightMiddle: 500,
  weightRegular: 400,

  flexMixIn: (justify: string, align: string) => `
    display: flex;
    justify-content: ${justify};
    align-items: ${align};
  `,

  wrapper: (width = '1040px', margin = '0px') => `
  width : ${width};
  margin : ${margin} auto;
  `,
};

export default theme;
