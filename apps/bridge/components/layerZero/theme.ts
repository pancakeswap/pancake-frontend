import { darkColors, lightColors } from '@pancakeswap/ui/tokens/colors'
import createBreakpoints from '@material-ui/core/styles/createBreakpoints'

export const breakpoints = createBreakpoints({
  keys: ['xs', 'sm', 'md', 'lg', 'xl'],
  values: {
    xs: 0,
    sm: 600,
    md: 960,
    lg: 1280,
    xl: 1920,
  },
  unit: 'px',
})

export const darkTheme = {
  breakpoints,
  palette: {
    mode: 'dark',
    primary: {
      main: darkColors.primary,
      contrastText: darkColors.invertedContrast,
    },
    secondary: {
      main: darkColors.input,
      contrastText: darkColors.contrast,
    },
    info: {
      main: darkColors.primary,
      light: darkColors.invertedContrast,
    },
    success: {
      main: darkColors.success,
    },
    error: {
      main: darkColors.failure,
    },
    warning: {
      main: darkColors.warning,
    },
    text: {
      primary: darkColors.text,
      secondary: darkColors.textSubtle,
    },
    divider: darkColors.cardBorder,
    background: {
      default: '#27262c',
    },
  },
  shape: {
    borderRadius: 18,
  },
  typography: {
    fontFamily: "'Kanit', sans-serif",
  },
}

export const lightTheme = {
  breakpoints,
  palette: {
    mode: 'light',
    primary: {
      main: lightColors.primary,
      contrastText: lightColors.invertedContrast,
    },
    secondary: {
      main: lightColors.input,
      contrastText: lightColors.contrast,
    },
    info: {
      main: lightColors.primary,
      light: lightColors.invertedContrast,
    },
    success: {
      main: lightColors.success,
    },
    error: {
      main: lightColors.failure,
    },
    warning: {
      main: lightColors.warning,
    },
    text: {
      primary: lightColors.text,
      secondary: lightColors.textSubtle,
    },
    divider: lightColors.cardBorder,
    background: {
      default: lightColors.backgroundAlt,
    },
  },
  shape: {
    borderRadius: 18,
  },
  typography: {
    fontFamily: "'Kanit', sans-serif",
  },
}
