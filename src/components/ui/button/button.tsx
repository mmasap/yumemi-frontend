import { ComponentProps, ReactNode } from 'react'
import styles from './button.module.css'

type ButtonProps = ComponentProps<'button'> & {
  variant?: 'primary' | 'secondary'
  children: ReactNode
}

export const Button = ({
  children,
  variant = 'primary',
  className = '',
  ...props
}: ButtonProps) => {
  const variantClassName = variant === 'primary' ? styles.primary : styles.secondary
  return (
    <button className={[styles.button, variantClassName, className].join(' ').trim()} {...props}>
      {children}
    </button>
  )
}
