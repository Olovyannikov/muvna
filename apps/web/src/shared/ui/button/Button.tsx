import clsx from 'clsx';
import type { ButtonHTMLAttributes, ReactNode } from 'react';

import { AppLink } from '../app-link/AppLink';
import styles from './Button.module.css';

type Variant = 'primary' | 'accent' | 'outline' | 'ghost';

interface CommonProps {
  variant?: Variant;
  size?: 'default' | 'small';
  block?: boolean;
  children: ReactNode;
  className?: string;
}

const classes = ({
  variant = 'primary',
  size = 'default',
  block,
  className,
}: Omit<CommonProps, 'children'>) =>
  clsx(styles.button, styles[variant], size === 'small' && styles.small, block && styles.block, className);

export const Button = ({
  variant,
  size,
  block,
  className,
  type = 'button',
  ...props
}: CommonProps & ButtonHTMLAttributes<HTMLButtonElement>) => (
  <button type={type} className={classes({ variant, size, block, className })} {...props} />
);

export const ButtonLink = ({
  variant,
  size,
  block,
  className,
  href,
  children,
}: CommonProps & { href: string }) => (
  <AppLink href={href} className={classes({ variant, size, block, className })}>
    {children}
  </AppLink>
);
