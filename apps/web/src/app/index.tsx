import { allSettled, fork } from 'effector';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { appStarted } from '@/shared/lib';

import { App } from './App';

import './model';
// Mantine в каскадном слое: наши CSS-модули и глобальные стили (вне слоёв) всегда сильнее.
import './styles/layers.css';
import '@mantine/core/styles.layer.css';
import '@mantine/carousel/styles.layer.css';
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
