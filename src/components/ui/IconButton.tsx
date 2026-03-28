import type { ReactNode, ButtonHTMLAttributes } from 'react';

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'default' | 'ghost' | 'primary';
}

export function IconButton({ children, variant = 'default', className = '', ...props }: IconButtonProps) {
  const base = 'inline-flex items-center justify-center rounded-lg transition-colors disabled:opacity-50';
  const variants = {
    default: 'p-2 hover:bg-gray-100',
    ghost: 'p-2 hover:bg-white/10',
    primary: 'px-4 py-2 bg-navy text-white hover:bg-navy/90',
  };

  return (
    <button className={`${base} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
}
