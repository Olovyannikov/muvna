import { Button as MantineButton, type ButtonProps as MantineButtonProps } from '@mantine/core';
import type { ButtonHTMLAttributes, ReactNode } from 'react';

import { AppLink } from '../app-link/AppLink';

type Variant = 'primary' | 'accent' | 'outline';

interface CommonProps {
  variant?: Variant;
  size?: 'default' | 'small';
  block?: boolean;
  children: ReactNode;
  className?: string;
}

/** Наши варианты → вариант и цвет Mantine (палитры ink/brass из темы). */
const toMantine = ({ variant = 'primary', size = 'default', block }: Omit<CommonProps, 'children'>) =>
  ({
    variant: variant === 'outline' ? 'outline' : 'filled',
    color: variant === 'accent' ? 'brass.4' : 'ink.9',
    autoContrast: true,
    size: size === 'small' ? 'sm' : 'lg',
    fullWidth: block,
  }) satisfies MantineButtonProps;

export const Button = ({
  variant,
  size,
  block,
  className,
  type = 'button',
  ...props
}: CommonProps & ButtonHTMLAttributes<HTMLButtonElement>) => (
  <MantineButton type={type} className={className} {...toMantine({ variant, size, block })} {...props} />
);

export const ButtonLink = ({
  variant,
  size,
  block,
  className,
  href,
  children,
}: CommonProps & { href: string }) => (
  <MantineButton
    component={AppLink}
    href={href}
    className={className}
    {...toMantine({ variant, size, block })}
  >
    {children}
  </MantineButton>
);
