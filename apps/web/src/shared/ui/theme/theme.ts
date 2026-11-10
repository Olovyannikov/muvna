import { createTheme, type MantineColorsTuple } from '@mantine/core';

import classes from './theme.module.css';

/** Латунный акцент MUVNA (#c9b57a — оттенок 4, #8c7a45 — 7). */
const brass: MantineColorsTuple = [
  '#f9f6ec',
  '#f0ead6',
  '#e3d8b4',
  '#d6c690',
  '#c9b57a',
  '#bba665',
  '#a99354',
  '#8c7a45',
  '#6f6037',
  '#524728',
];

const ink: MantineColorsTuple = [
  '#f2f2f2',
  '#d9d9d9',
  '#bfbfbf',
  '#a6a6a6',
  '#8c8c8c',
  '#5c5c5c',
  '#3d3d3d',
  '#262626',
  '#1d1c1a',
  '#121212',
];

/** Тема Mantine из токенов сайта (app/styles/tokens.css) — компоненты выглядят «по-нашему». */
export const theme = createTheme({
  fontFamily: "'Jost Variable', 'Jost', system-ui, -apple-system, 'Segoe UI', sans-serif",
  headings: { fontFamily: "'Jost Variable', 'Jost', system-ui, sans-serif", fontWeight: '300' },
  colors: { brass, ink },
  primaryColor: 'ink',
  primaryShade: 9,
  black: '#121212',
  white: '#faf8f4',
  defaultRadius: 0,
  cursorType: 'pointer',
  focusClassName: classes.focus,
  components: {
    Button: {
      defaultProps: { size: 'lg', radius: 0 },
      classNames: { root: classes.button, label: classes.buttonLabel },
    },
    Input: { classNames: { input: classes.input } },
    InputWrapper: { classNames: { label: classes.label, error: classes.error } },
    Drawer: {
      defaultProps: { position: 'right', size: 440, overlayProps: { backgroundOpacity: 0.45, blur: 0 } },
      classNames: {
        content: classes.drawerContent,
        header: classes.drawerHeader,
        title: classes.drawerTitle,
      },
    },
    ActionIcon: { defaultProps: { variant: 'subtle', color: 'ink', radius: 0 } },
    Skeleton: { classNames: { root: classes.skeleton } },
  },
});
