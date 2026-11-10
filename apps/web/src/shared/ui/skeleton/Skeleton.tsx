import { Skeleton as MantineSkeleton } from '@mantine/core';
import type { CSSProperties } from 'react';

export const Skeleton = ({ className, style }: { className?: string; style?: CSSProperties }) => (
  <MantineSkeleton className={className} style={style} radius={0} aria-hidden="true" />
);
