const defaultTypography = {
  fontFamily: '"Roboto Mono", monospace',
  h1: {
    fontSize: 28,
    lineHeight: '36px',
    fontWeight: 500,
  },
  h2: {
    fontSize: 24,
    lineHeight: '28px',
    fontWeight: 500,
  },
  h3: {
    fontSize: 20,
    lineHeight: '24px',
    fontWeight: 500,
  },
  p1: {
    fontSize: 16,
    lineHeight: '24px',
    fontWeight: 400,
  },
  p2: {
    fontSize: 14,
    lineHeight: '20px',
    letterSpacing: '-0.02em',
    fontWeight: 400,
  },
  p3: {
    fontSize: 12,
    lineHeight: '16px',
    fontWeight: 400,
  },
  caption: {
    fontSize: 10,
    lineHeight: '16px',
    fontWeight: 400,
  },
  link: {
    cursor: 'pointer',
    '&:hover': {
      opacity: 0.7,
    },
  },
}

const borderRadius = 18

export const PancakeSwapTheme = {
  dark: {
    typography: {
      ...defaultTypography,
      fontFamily: "'Kanit', sans-serif",
    },
    shape: { borderRadius },
    palette: {
      mode: 'dark',
      primary: {
        main: '#1EC7D3',
        contrastText: '#191326',
        light: '#1EC7D3',
      },
      secondary: {
        main: '#372F47',
        contrastText: '#F4EEFF',
        light: '#372F47',
      },
      info: { main: '#1EC7D3' },
      success: { main: '#8AE06C' },
      error: { main: '#F56868' },
      warning: { main: '#F1DF38' },
      text: {
        primary: '#F4EEFF',
        secondary: '#B8ADD2',
      },
      divider: '#383241',
      background: {
        paper: '#27262D',
        default: '#27262D',
      },
    },
  },
  light: {
    typography: {
      ...defaultTypography,
      fontFamily: "'Kanit', sans-serif",
    },
    shape: { borderRadius },
    palette: {
      mode: 'light',
      primary: {
        main: '#1EC7D3',
        contrastText: '#FFFFFF',
        light: '#1EC7D3',
      },
      secondary: {
        main: '#EEEAF4',
        contrastText: '#280D5F',
        light: '#EEEAF4d',
      },
      info: { main: '#1EC7D3' },
      success: { main: '#8AE06C' },
      error: { main: '#F56868' },
      warning: { main: '#F1DF38' },
      text: {
        primary: '#280D5F',
        secondary: '#7C70AB',
      },
      divider: '#E7E3EB',
      background: {
        paper: '#FFFFFF',
        default: '#FFFFFF',
      },
    },
  },
}
