import { allSettled, fork } from 'effector';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { appStarted } from '@/shared/lib';

import { App } from './App';

import './model';
import './styles/global.css';

// Всё состояние живёт в скоупе: компоненты читают его через <Provider>, внешние колбэки — через scopeBind.
const scope = fork();

const root = document.getElementById('root');
if (!root) throw new Error('#root not found');

createRoot(root).render(
  <StrictMode>
    <App scope={scope} />
  </StrictMode>,
);

void allSettled(appStarted, { scope });
