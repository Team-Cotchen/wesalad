import 'styled-components';

declare module 'styled-components' {
  export interface DefaultTheme {
    mainGreen: string;
    lightGreen: string;
    mainViolet: string;
    lightGray: string;

    fontLarge: string;
    fontMedium: string;
    fontSemiMedium: string;
    fontRegular: string;
    fontSmall: string;
    fontMicro: string;

    weightBold: number;
    weightSemiBold: number;
    weightMiddle: number;
    weightRegular: number;

    flexMixIn: function;
    wrapper: function;
  }
}
