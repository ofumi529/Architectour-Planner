import clsx from 'clsx';
import type { ButtonHTMLAttributes } from 'react';

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
}

export default function Button({
  variant = 'primary',
  size = 'md',
  className,
  ...rest
}: Props) {
  const variantClasses: Record<string, string> = {
    primary: 'wood-accent text-white font-semibold tracking-wide architectural-transition glass-reflection',
    secondary: 'steel-button architectural-transition',
    danger: 'bg-red-600 text-white hover:bg-red-700 deep-shadow',
  };
  const sizeClasses: Record<string, string> = {
    sm: 'px-3 py-2 text-xs',
    md: 'px-4 py-2.5 text-sm',
    lg: 'px-6 py-3 text-base',
  };
  return (
    <button
      {...rest}
      className={clsx(
        'rounded-lg font-medium construct-in relative overflow-hidden',
        variantClasses[variant], 
        sizeClasses[size], 
        className
      )}
    />
  );
}
