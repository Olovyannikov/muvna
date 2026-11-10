import { createGate } from 'effector-react';

/**
 * Страница начинается с полноэкранного фото — шапка рисуется поверх него прозрачной.
 * Открыт, пока смонтирован <HeroGate /> (первый экран страницы).
 */
export const HeroGate = createGate({ name: 'hero' });

export const $hasHero = HeroGate.status;
